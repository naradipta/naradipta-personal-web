#!/usr/bin/env python3
"""Gabungkan questions/*.json menjadi ../public/learn/data/questions.js (agar app jalan dengan klik dua kali, tanpa server).
Soal lama istqb-0xx diberi tag learning objective lewat peta di bawah.
Jalankan: python3 tools/build-data.py   (dari folder qa-drill/)
Pemeriksaan: ID unik, LO dikenal, K soal tidak boleh melebihi K LO, dan jawaban benar tidak boleh
terlalu sering menjadi opsi terpanjang (bias panjang opsi memungkinkan menebak tanpa memahami).
"""
import json, glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(os.path.dirname(ROOT), "public", "learn")
MAX_CLEAR_LONGEST = 0.30  # acak murni dengan 4 opsi kira-kira 0.2-0.25

# id soal lama -> (learning objective, K-level). None = tidak ada LO resmi yang pas (tetap masuk latihan umum).
OLD_ISTQB = {
    "istqb-001": ("FL-1.2.3", 2), "istqb-002": ("FL-1.3.1", 2), "istqb-003": ("FL-1.3.1", 2),
    "istqb-004": (None, 2), "istqb-005": ("FL-2.2.3", 2), "istqb-006": ("FL-4.2.2", 3),
    "istqb-007": ("FL-4.2.1", 3), "istqb-008": ("FL-4.2.3", 2), "istqb-009": ("FL-4.2.4", 2),
    "istqb-010": ("FL-5.5.1", 2), "istqb-011": (None, 2), "istqb-012": ("FL-2.2.1", 2),
    "istqb-013": ("FL-3.1.3", 2), "istqb-014": ("FL-4.3.1", 2), "istqb-015": ("FL-4.3.2", 2),
    "istqb-016": (None, 2), "istqb-017": ("FL-4.4.2", 2), "istqb-018": ("FL-4.1.1", 2),
    "istqb-019": ("FL-2.1.5", 2), "istqb-020": ("FL-1.3.1", 2), "istqb-021": ("FL-5.1.1", 2),
    "istqb-022": ("FL-3.2.4", 2), "istqb-023": ("FL-2.2.3", 2), "istqb-024": ("FL-5.2.3", 2),
    "istqb-025": ("FL-2.2.2", 2), "istqb-026": ("FL-1.3.1", 2), "istqb-027": ("FL-1.3.1", 2),
    "istqb-028": ("FL-5.5.1", 2), "istqb-029": ("FL-1.4.4", 2), "istqb-030": ("FL-2.2.1", 2),
    "istqb-031": ("FL-5.1.3", 2), "istqb-032": ("FL-1.2.2", 1),
}

def lo_levels():
    with open(os.path.join(APP, "data", "lo.js"), encoding="utf-8") as f:
        return {m.group(1): int(m.group(2)) for m in re.finditer(r'LO\("(FL-\d\.\d\.\d)", (\d)', f.read())}

def check(qs):
    levels = lo_levels()
    for q in qs:
        lo = q.get("lo")
        if not lo:
            continue
        if lo not in levels:
            sys.exit("LO tidak dikenal: %s -> %s" % (q["id"], lo))
        if q.get("k", 2) > levels[lo]:
            sys.exit("K-level soal %s (K%s) melebihi K LO %s (K%s)" % (q["id"], q.get("k"), lo, levels[lo]))
    mcq = [q for q in qs if q["type"] == "mcq"]
    for q in mcq:
        for lang in ("id", "en"):
            if len(q["options"][lang]) != len(q["options"]["en"]):
                sys.exit("Jumlah opsi ID/EN tidak sama: " + q["id"])
    # Bias panjang: jawaban benar yang jelas lebih panjang (>= 15%) dari semua pengecoh. Opsi berupa kode/angka
    # (sintaks, kode status) dikecualikan karena panjangnya ditentukan oleh sintaks, bukan oleh gaya penulisan.
    def code_like(o):
        return bool(re.search(r"[()=<>_\[\]{}\\]|^\d|--|\.\w+\(", o))
    graded = [q for q in mcq if not all(code_like(o) for o in q["options"]["en"])]
    def clear_longest(q):
        lens = [len(o) for o in q["options"]["en"]]
        a = lens[q["answer"]]
        others = max(l for i, l in enumerate(lens) if i != q["answer"])
        return a >= 1.15 * others
    bad = [q for q in graded if clear_longest(q)]
    ratio = len(bad) / max(1, len(graded))
    strict = sum(1 for q in mcq if len(q["options"]["en"][q["answer"]]) == max(map(len, q["options"]["en"])))
    print("jawaban benar = opsi terpanjang: %d/%d; jelas terpanjang (>=15%%): %d/%d (%.0f%%, batas %.0f%%)" % (strict, len(mcq), len(bad), len(graded), ratio * 100, MAX_CLEAR_LONGEST * 100))
    if ratio > MAX_CLEAR_LONGEST:
        sys.exit("Bias panjang opsi terlalu tinggi (%d soal): panjangkan pengecoh atau ringkas jawaban benar. Contoh: %s" % (len(bad), ", ".join(q["id"] for q in bad[:10])))

def main():
    out = []
    ids = set()
    for path in sorted(glob.glob(os.path.join(ROOT, "questions", "*.json"))):
        with open(path, encoding="utf-8") as f:
            for q in json.load(f):
                if q["id"] in ids:
                    sys.exit("ID ganda: " + q["id"])
                ids.add(q["id"])
                if q["id"] in OLD_ISTQB:
                    lo, k = OLD_ISTQB[q["id"]]
                    q["lo"] = lo
                    q["k"] = k
                out.append(q)
    check(out)
    data_dir = os.path.join(APP, "data")
    os.makedirs(data_dir, exist_ok=True)
    with open(os.path.join(data_dir, "questions.js"), "w", encoding="utf-8") as f:
        f.write("// Dibuat otomatis oleh tools/build-data.py. Jangan diedit; edit file di questions/ lalu jalankan ulang.\n")
        f.write("window.QA = window.QA || {};\nQA.questions = ")
        json.dump(out, f, ensure_ascii=False, indent=0)
        f.write(";\n")
    print(len(out), "soal ditulis ke data/questions.js")

if __name__ == "__main__":
    main()
