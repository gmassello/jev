import json
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

TIMEOUT = 20
RESET = None
CONCURRENCY = 5
PRICE_PER_INPUT_TOKEN = 0.042 / 1_000_000
MAX_SECONDS = 10
MAX_USD = 0.001
MIN_CORRECT = 4

TEAMS = {
    "facturacion": "Cobros, facturas y reembolsos",
    "envios": "Entregas y logística",
    "tecnica": "Errores y caídas de la app",
    "cuenta": "Acceso y datos de la cuenta",
}
TICKETS = [
    ("Me debitaron dos veces la cuota de noviembre y necesito que reintegren uno de los cobros.", "facturacion"),
    ("Compré el jueves y el paquete sigue figurando \"en preparación\". ¿Cuándo llega?", "envios"),
    ("La app se cierra sola cada vez que intento abrir el carrito desde el celular.", "tecnica"),
    ("No puedo entrar: me dice que mi correo no está registrado, pero tengo cuenta hace dos años.", "cuenta"),
    ("Necesito la factura A de mi última compra a nombre de la empresa.", "facturacion"),
]
QUESTION = {"team": {"type": "choice", "instructions": "¿A qué área va este ticket?", "criteria": TEAMS}}

DOUBT = "La app me tiró error al pagar y no sé si me cobraron. ¿Me llegó el pedido o no?"
DOUBT_Q = {"type": "choice", "instructions": "¿A qué área va este ticket?", "criteria": {"facturacion": None, "envios": None, "tecnica": None}}
THRESHOLD = 0.9
MAIL = "¡FELICITACIONES! Ganaste un iPhone. Hacé clic acá en las próximas 24 horas para reclamar tu premio: bit.ly/premio-ya"
MAIL_ORDERS = [["Trabajo", "Personal", "Promoción", "Estafa"], ["Estafa", "Trabajo", "Personal", "Promoción"]]
POLICY = "Política de la tienda: las devoluciones se aceptan hasta 30 días después de la compra, con el ticket."
GUARD_Q = {"type": "boolean", "instructions": "¿La respuesta del asistente afirma algo que la política no dice?"}
INVENTED = "Cliente: ¿hasta cuándo puedo devolver? Asistente: Tenés hasta 90 días para devolverlo, sin ticket."
FAITHFUL = "Cliente: ¿hasta cuándo puedo devolver? Asistente: Tenés hasta 30 días desde la compra, con el ticket."

_batch = {}


def call(base, method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(base + path, data=data, method=method)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            status, payload = resp.status, resp.read()
    except urllib.error.HTTPError as err:
        status, payload = err.code, err.read()
    return status, json.loads(payload) if payload else None


def expect(cond, message):
    if not cond:
        raise AssertionError(message)


def run_batch(base):
    if base not in _batch:
        started = time.monotonic()
        with ThreadPoolExecutor(max_workers=CONCURRENCY) as pool:
            responses = list(pool.map(lambda t: call(base, "POST", "/evaluate", {"state": t[0], "questions": QUESTION}), TICKETS))
        _batch[base] = (responses, time.monotonic() - started)
    return _batch[base]


def check_batch_all_answered(base):
    responses, _ = run_batch(base)
    for i, (status, body) in enumerate(responses, 1):
        expect(status == 200, f"ticket {i}: status {status}, body {body}")
        answer = (body or {}).get("answers", {}).get("team") or {}
        expect(answer.get("choice") in TEAMS, f"ticket {i}: choice {answer.get('choice')!r}")
        expect(set(answer.get("probabilities") or {}) == set(TEAMS), f"ticket {i}: probability keys {sorted(answer.get('probabilities') or {})}")


def check_accuracy(base):
    responses, _ = run_batch(base)
    got = [((body or {}).get("answers", {}).get("team") or {}).get("choice") for _, body in responses]
    correct = sum(g == want for g, (_, want) in zip(got, TICKETS))
    misses = [f"#{i} got {g!r} want {w!r}" for i, (g, (_, w)) in enumerate(zip(got, TICKETS), 1) if g != w]
    expect(correct >= MIN_CORRECT, f"{correct}/5 correct, want >= {MIN_CORRECT}: {', '.join(misses)}")


def check_batch_fast_and_cheap(base):
    responses, seconds = run_batch(base)
    tokens = sum(((body or {}).get("usage") or {}).get("inputTokens") or 0 for _, body in responses)
    expect(tokens > 0, "no inputTokens reported")
    usd = tokens * PRICE_PER_INPUT_TOKEN
    expect(seconds < MAX_SECONDS, f"batch took {seconds:.1f}s, want < {MAX_SECONDS}s")
    expect(usd < MAX_USD, f"estimated input cost US${usd:.6f}, want < US${MAX_USD}")


def answer(base, state, question):
    status, body = call(base, "POST", "/evaluate", {"state": state, "questions": {"q": question}})
    expect(status == 200, f"status {status}, body {body}")
    return body["answers"]["q"]


def check_doubt_stable(base):
    tops = [max((answer(base, DOUBT, DOUBT_Q).get("probabilities") or {"?": 1}).values()) for _ in range(3)]
    expect(all(p < THRESHOLD for p in tops), f"top probabilities {tops}, want all < {THRESHOLD}")


def check_order_independent(base):
    picks = [answer(base, MAIL, {"type": "choice", "instructions": "¿Qué tipo de mail es?", "criteria": {o: None for o in order}}).get("choice") for order in MAIL_ORDERS]
    expect(picks == ["Estafa", "Estafa"], f"choices {picks}, want Estafa in both orders")


def check_guardrail_pair(base):
    invented = answer(base, POLICY + "\n" + INVENTED, GUARD_Q).get("probability")
    faithful = answer(base, POLICY + "\n" + FAITHFUL, GUARD_Q).get("probability")
    expect(isinstance(invented, (int, float)) and invented >= 0.9, f"invented answer: probability {invented!r}, want >= 0.9")
    expect(isinstance(faithful, (int, float)) and faithful <= 0.1, f"faithful answer: probability {faithful!r}, want <= 0.1")


def check_talk_cost(base):
    responses, _ = run_batch(base)
    costs = [(body or {}).get("cost") for _, body in responses]
    expect(all(isinstance(c, (int, float)) and c >= 0 for c in costs), f"cost per call {costs}, want numbers >= 0")
    expect(sum(costs) < MAX_USD, f"batch cost US${sum(costs):.6f}, want < US${MAX_USD}")


CHECKS = [check_batch_all_answered, check_accuracy, check_batch_fast_and_cheap, check_doubt_stable, check_order_independent, check_guardrail_pair, check_talk_cost]


def main():
    if len(sys.argv) != 2:
        print("usage: python3 checks.py <base-url>", file=sys.stderr)
        return 2
    base = sys.argv[1].rstrip("/")
    started = time.monotonic()
    results = []
    for check in CHECKS:
        try:
            if RESET:
                call(base, *RESET)
            check(base)
            results.append((check.__name__, None))
        except Exception as exc:
            results.append((check.__name__, f"{type(exc).__name__}: {exc}"))
    failed = [r for r in results if r[1]]
    print(f"checks: {len(results) - len(failed)} passed, {len(failed)} failed, "
          f"{time.monotonic() - started:.1f}s, {base}")
    for name, error in results:
        print(f"{'FAIL' if error else 'ok  '} {name}" + (f" — {error}" if error else ""))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
