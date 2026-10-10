import json
import pathlib
import re
import sys
import time

RESET = None
TOTAL = 15


def expect(cond, message):
    if not cond:
        raise AssertionError(message)


def load_runs(root):
    path = root / "challenge" / "results.json"
    expect(path.is_file(), f"{path} not found")
    runs = json.loads(path.read_text()).get("runs")
    expect(isinstance(runs, list) and runs, "results.json has no runs")
    return runs


def check_runs_consistent(root):
    for run in load_runs(root):
        name = run.get("question")
        rows = run.get("rows") or []
        expect(run.get("total") == TOTAL, f"{name}: total {run.get('total')}, want {TOTAL}")
        expect(len(rows) == TOTAL, f"{name}: {len(rows)} rows, want {TOTAL}")
        ok = sum(1 for r in rows if r.get("ok") is True)
        expect(run.get("correct") == ok, f"{name}: correct {run.get('correct')} != {ok} rows ok")


def check_trap_recorded(root):
    traps = [r for r in load_runs(root) if r.get("trap") is True]
    expect(traps, "no run marked trap: true")
    for run in traps:
        rows = run.get("rows") or []
        expect(len(rows) == TOTAL, f"{run.get('question')}: trap run has {len(rows)} rows, want {TOTAL}")
        missing = [r.get("id") for r in rows if not isinstance(r.get("confidence"), (int, float))]
        expect(not missing, f"{run.get('question')}: rows without confidence: {missing}")


def check_runs_measured(root):
    for run in load_runs(root):
        for field in ("tokens", "ms"):
            value = run.get(field)
            expect(isinstance(value, int) and value > 0, f"{run.get('question')}: {field} {value!r}")


def check_deck(root):
    pdf = root / "docs" / "deck.pdf"
    html = root / "docs" / "deck.html"
    expect(pdf.is_file() and pdf.stat().st_size > 0, f"{pdf} missing or empty")
    boxes = re.findall(rb"/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]", pdf.read_bytes())
    expect(boxes, "no /MediaBox found in deck.pdf")
    for box in boxes:
        x0, y0, x1, y1 = map(float, box)
        ratio = (x1 - x0) / (y1 - y0)
        expect(abs(ratio - 16 / 9) < 0.01, f"page ratio {ratio:.3f}, want 16:9")
    expect(html.is_file(), f"{html} not found")
    text = html.read_text()
    expect(re.search(r'<html[^>]*\blang="es"', text), 'deck.html without lang="es"')
    scores = {f"{r.get('correct')}/{TOTAL}" for r in load_runs(root)}
    expect(any(s in text for s in scores), f"deck.html shows none of the measured scores {sorted(scores)}")


def check_video(root):
    videos = [p for p in (root / "docs" / "video").glob("*.mp4") if p.stat().st_size > 0]
    expect(videos, "no non-empty .mp4 in docs/video/")


CHECKS = [check_runs_consistent, check_trap_recorded, check_runs_measured, check_deck, check_video]


def main():
    if len(sys.argv) != 2:
        print("usage: python3 checks.py <repo-path>", file=sys.stderr)
        return 2
    root = pathlib.Path(sys.argv[1])
    if not root.is_dir():
        print(f"usage: python3 checks.py <repo-path> ({root} is not a directory)", file=sys.stderr)
        return 2
    started = time.monotonic()
    results = []
    for check in CHECKS:
        try:
            check(root)
            results.append((check.__name__, None))
        except Exception as exc:
            results.append((check.__name__, f"{type(exc).__name__}: {exc}"))
    failed = [r for r in results if r[1]]
    print(f"checks: {len(results) - len(failed)} passed, {len(failed)} failed, "
          f"{time.monotonic() - started:.1f}s, {root}")
    for name, error in results:
        print(f"{'FAIL' if error else 'ok  '} {name}" + (f" — {error}" if error else ""))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
