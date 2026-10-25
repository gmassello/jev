import json
import re
import subprocess
import sys
import time
from pathlib import Path

VIDEO = ["what", "boolean", "choice", "criteria", "multi", "doubt", "when", "guard", "defects", "code"]
STEPS = 15
SPOKEN_WORDS = (2700, 3100)
TITLE = "Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad"
MAX_VIDEO_SECONDS = 1260


def expect(cond, message):
    if not cond:
        raise AssertionError(message)


def lessons(root):
    script = "import(process.argv[1]).then(m=>console.log(JSON.stringify({es:m.I18N.es.lessons,en:m.I18N.en.lessons})))"
    out = subprocess.run(["node", "-e", script, (root / "copy.js").resolve().as_uri()], capture_output=True, text=True, timeout=30)
    expect(out.returncode == 0, f"node could not read copy.js: {out.stderr.strip()[:200]}")
    return json.loads(out.stdout)


def check_lesson_steps(root):
    data = lessons(root)
    es, en = [l["id"] for l in data["es"]], [l["id"] for l in data["en"]]
    expect(len(es) == STEPS, f"{len(es)} steps in es, want {STEPS}")
    expect(es == en, f"es and en step ids differ: {es} vs {en}")
    missing = [i for i in VIDEO if i not in es]
    expect(not missing, f"video steps missing: {missing}")


def check_snippet_current_api(root):
    code = next((l for l in lessons(root)["es"] if l["id"] == "code"), {}).get("code", "")
    expect("experimental_decide" in code, "the code step does not use experimental_decide")
    expect("experimental_evaluate" not in code, "the code step still uses experimental_evaluate")


def check_guion(root):
    path = root / "docs" / "GUION.md"
    expect(path.is_file(), "docs/GUION.md not found")
    text = path.read_text()
    ids = [l["id"] for l in lessons(root)["es"]]
    found = re.findall(r"^### (\S+)", text, re.M)
    expect(found == ids, f"guion steps {found}, want {ids}")
    sections = dict(zip(found, re.split(r"^### \S+.*$", text, flags=re.M)[1:]))
    for step in VIDEO:
        expect(re.search(r"^Bloque:", sections.get(step, ""), re.M), f"video step {step} has no 'Bloque:' line")
    for step in set(ids) - set(VIDEO):
        expect(re.search(r"^Fuera del video:", sections.get(step, ""), re.M), f"step {step} has no 'Fuera del video:' line")


def check_script(root):
    path = root / "video" / "script.tsv"
    expect(path.is_file(), "video/script.tsv not found")
    rows = [line.split("\t") for line in path.read_text().splitlines()[1:] if line.strip()]
    expect(all(len(r) == 3 for r in rows), "every script row needs beat, en and es")
    words = sum(len(r[2].split()) for r in rows)
    low, high = SPOKEN_WORDS
    expect(low <= words <= high, f"{words} spoken words, want {low}-{high} (~20 min)")


def check_deck(root):
    html = root / "docs" / "deck.html"
    pdf = root / "docs" / "deck.pdf"
    expect(html.is_file() and TITLE in html.read_text(), "docs/deck.html does not carry the talk title")
    expect(pdf.is_file() and pdf.stat().st_size > 0, "docs/deck.pdf missing or empty")


def check_video(root):
    video = root / "video" / "out" / "demo.mp4"
    expect(video.is_file() and video.stat().st_size > 0, "video/out/demo.mp4 missing or empty")
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(video)],
                         capture_output=True, text=True, timeout=30)
    expect(out.returncode == 0, f"ffprobe failed: {out.stderr.strip()[:200]}")
    seconds = float(out.stdout.strip())
    expect(seconds <= MAX_VIDEO_SECONDS, f"video lasts {seconds:.0f}s, want <= {MAX_VIDEO_SECONDS}s")


CHECKS = [check_lesson_steps, check_snippet_current_api, check_guion, check_script, check_deck, check_video]


def main():
    if len(sys.argv) != 2:
        print("usage: python3 checks.py <repo-root>", file=sys.stderr)
        return 2
    root = Path(sys.argv[1])
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
