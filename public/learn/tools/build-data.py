#!/usr/bin/env python3
"""Gabungkan questions/*.json menjadi data/questions.js (agar app jalan dengan klik dua kali, tanpa server).
Soal lama istqb-0xx diberi tag learning objective lewat peta di bawah.
Jalankan: python3 tools/build-data.py   (dari folder proyek)
"""
import json, glob, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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
    data_dir = os.path.join(ROOT, "data")
    os.makedirs(data_dir, exist_ok=True)
    with open(os.path.join(data_dir, "questions.js"), "w", encoding="utf-8") as f:
        f.write("// Dibuat otomatis oleh tools/build-data.py. Jangan diedit; edit file di questions/ lalu jalankan ulang.\n")
        f.write("window.QA = window.QA || {};\nQA.questions = ")
        json.dump(out, f, ensure_ascii=False, indent=0)
        f.write(";\n")
    print(len(out), "soal ditulis ke data/questions.js")

if __name__ == "__main__":
    main()
