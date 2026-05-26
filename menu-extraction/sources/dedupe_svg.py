"""Dedupe the SVG-extracted images: remove background textures (recurring large
images) and any duplicate hashes; keep one of each unique asset.
"""
import hashlib
import shutil
from pathlib import Path
from collections import defaultdict

SRC = Path("menu-extraction/sources/from-svg/newry-v2")
DST = Path("menu-extraction/sources/from-svg/newry-v2-clean")
DST.mkdir(parents=True, exist_ok=True)

# Pre-existing files cleaned up
for f in DST.iterdir(): f.unlink()

by_hash: dict[str, Path] = {}
counts: dict[str, int] = defaultdict(int)

for f in sorted(SRC.glob("*.*")):
    h = hashlib.md5(f.read_bytes()).hexdigest()
    counts[h] += 1
    by_hash.setdefault(h, f)

# Decide which hashes are "decorative" (appear on >2 different pages) and should be dropped
RECURRING_THRESHOLD = 3
decorative = {h for h, c in counts.items() if c >= RECURRING_THRESHOLD}

print(f"Unique hashes: {len(by_hash)}")
print(f"Dropped as decorative (appears on ≥{RECURRING_THRESHOLD} pages): {len(decorative)}")

kept = 0
for h, src in by_hash.items():
    if h in decorative:
        continue
    shutil.copy2(src, DST / src.name)
    kept += 1

print(f"Kept clean photos: {kept} → {DST}")
