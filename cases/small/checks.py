import json
import sys
import time
import urllib.error
import urllib.request

TIMEOUT = 20
RESET = None

TICKET = "Hola, me cobraron dos veces la suscripción de octubre. Quiero que me devuelvan uno de los cargos."
TEAMS = {
    "facturacion": "Cobros, facturas y reembolsos",
    "envios": "Entregas y logística",
    "tecnica": "Errores y caídas de la app",
    "cuenta": "Acceso y datos de la cuenta",
}


def request(base, method, path, body=None, raw=None):
    data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    req = urllib.request.Request(base + path, data=data, method=method)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            return resp.status, resp.headers.get("content-type", ""), resp.read()
    except urllib.error.HTTPError as err:
        return err.code, err.headers.get("content-type", ""), err.read()


def call(base, method, path, body=None, raw=None):
    status, _, payload = request(base, method, path, body, raw)
    return status, json.loads(payload) if payload else None


def expect(cond, message):
    if not cond:
        raise AssertionError(message)


def evaluate(base, questions):
    status, body = call(base, "POST", "/evaluate", {"state": TICKET, "questions": questions})
    expect(status == 200, f"status {status}, body {body}")
    return body


def check_page_serves_playground(base):
    status, ctype, payload = request(base, "GET", "/")
    expect(status == 200, f"status {status}")
    expect("text/html" in ctype, f"content-type {ctype!r}")
    expect(b"<title>Jev Playground</title>" in payload, "title Jev Playground not found")


def check_refund_boolean(base):
    body = evaluate(base, {"refund": {"type": "boolean", "instructions": "¿El cliente pide un reembolso?"}})
    p = body["answers"]["refund"]["probability"]
    expect(isinstance(p, (int, float)) and 0 <= p <= 1, f"probability {p!r} outside [0, 1]")
    expect(p >= 0.5, f"probability {p} < 0.5 for an explicit refund request")


def check_team_choice(base):
    body = evaluate(base, {"team": {"type": "choice", "instructions": "¿A qué área va este ticket?", "criteria": TEAMS}})
    answer = body["answers"]["team"]
    expect(answer["choice"] == "facturacion", f"choice {answer['choice']!r}, want 'facturacion'")
    probs = answer.get("probabilities") or {}
    expect(set(probs) == set(TEAMS), f"probability keys {sorted(probs)}, want {sorted(TEAMS)}")
    expect(abs(sum(probs.values()) - 1) <= 0.02, f"probabilities sum {sum(probs.values())}")


def check_usage_and_timing(base):
    body = evaluate(base, {"refund": {"type": "boolean", "instructions": "¿El cliente pide un reembolso?"}})
    usage = body.get("usage") or {}
    tin, tout, total = usage.get("inputTokens"), usage.get("outputTokens"), usage.get("totalTokens")
    expect(isinstance(tin, int) and tin > 0, f"inputTokens {tin!r}")
    expect(isinstance(tout, int) and tout > 0, f"outputTokens {tout!r}")
    expect(total == tin + tout, f"totalTokens {total} != {tin} + {tout}")
    expect(isinstance(body.get("ms"), (int, float)) and body["ms"] > 0, f"ms {body.get('ms')!r}")
    expect(body.get("modelId") == "typesafe-ai/jev", f"modelId {body.get('modelId')!r}")
    expect(isinstance(body.get("warnings"), list), f"warnings {body.get('warnings')!r}")


def check_confidence_and_cost(base):
    body = evaluate(base, {"team": {"type": "choice", "instructions": "¿A qué área va este ticket?", "criteria": TEAMS}})
    confidence = body.get("confidence")
    expect(isinstance(confidence, dict) and set(confidence) == {"team"}, f"confidence {confidence!r}, want one entry per question id")
    c = confidence["team"]
    expect(isinstance(c, (int, float)) and 0 <= c <= 1, f"confidence {c!r} outside [0, 1]")
    cost = body.get("cost")
    expect(isinstance(cost, (int, float)) and cost >= 0, f"cost {cost!r}, want a number >= 0")


def check_invalid_json(base):
    status, body = call(base, "POST", "/evaluate", raw=b"{")
    expect(status == 500, f"status {status}, want 500")
    expect(isinstance((body or {}).get("error"), str) and body["error"], f"error missing: {body}")


def check_unknown_route(base):
    status, body = call(base, "GET", "/does-not-exist")
    expect(status == 404, f"status {status}, want 404")
    expect((body or {}).get("error") == "not found", f"body {body}")


CHECKS = [
    check_page_serves_playground,
    check_refund_boolean,
    check_team_choice,
    check_usage_and_timing,
    check_confidence_and_cost,
    check_invalid_json,
    check_unknown_route,
]


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
