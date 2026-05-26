"""Extract embedded images from all Sweet Life PDF exports in ~/Downloads
and from the existing sweet-life-pdf-photos folder.

Deduplicates by MD5 hash against our existing reference library, then writes
new unique images to references/aesthetics/canva-menu-pdf-extra/.
"""
import hashlib
import shutil
import sys
from pathlib import Path

import fitz   # PyMuPDF

BRAND = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry")
DEST = BRAND / "references/aesthetics/canva-menu-pdf-extra"
DEST.mkdir(parents=True, exist_ok=True)

PDFS = [
    Path.home() / "Downloads/Sweet Life Menu Drogheda V2.pdf",
    Path.home() / "Downloads/Sweet Life Menu Drogheda V2 (1).pdf",
    Path.home() / "Downloads/Sweet Life Menu Drogheda V2 (2).pdf",
    Path.home() / "Downloads/Sweet Life Menu Newry V2 (Flyer (A4))-2.pdf",
    Path.home() / "Downloads/Sweet Life Menu Newry V2.pdf",
    Path.home() / "Downloads/Sweet Life Menu Newry V2-2.pdf",
]
EXISTING_PHOTOS_DIR = Path.home() / "Downloads/sweet-life-pdf-photos"

# Build hash set of all existing reference images
print("Building hash index of existing references...")
existing_hashes: set[str] = set()
for f in (BRAND / "references").rglob("*.*"):
    if f.suffix.lower() in {".jpg",".jpeg",".png",".webp",".heic",".tiff",".gif"}:
        existing_hashes.add(hashlib.md5(f.read_bytes()).hexdigest())
print(f"  {len(existing_hashes)} existing image hashes")

def safe_write(data: bytes, name_hint: str, source_tag: str):
    h = hashlib.md5(data).hexdigest()
    if h in existing_hashes:
        return False
    if len(data) < 8 * 1024:    # < 8KB likely icons
        return False
    existing_hashes.add(h)
    safe = name_hint.replace("/", "_").replace(" ", "-")[:60]
    out = DEST / f"{source_tag}-{safe}-{h[:8]}.png"
    out.write_bytes(data)
    return True

# Extract from each PDF
total_new = 0
for pdf in PDFS:
    if not pdf.exists():
        print(f"  MISSING: {pdf.name}")
        continue
    try:
        doc = fitz.open(str(pdf))
    except Exception as e:
        print(f"  ERR opening {pdf.name}: {e}")
        continue
    tag = pdf.stem.replace(" ", "-")[:30]
    n_new = 0
    for page_idx in range(len(doc)):
        page = doc[page_idx]
        for img_idx, img_info in enumerate(page.get_images(full=True)):
            xref = img_info[0]
            try:
                pix = fitz.Pixmap(doc, xref)
                if pix.n - pix.alpha >= 4:    # CMYK -> RGB
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                data = pix.tobytes("png")
                if safe_write(data, f"p{page_idx}-i{img_idx}", tag):
                    n_new += 1
            except Exception:
                pass
    print(f"  {pdf.name}: {n_new} new images")
    total_new += n_new
    doc.close()

# Also fold in the existing sweet-life-pdf-photos folder
if EXISTING_PHOTOS_DIR.exists():
    n_new = 0
    for f in EXISTING_PHOTOS_DIR.glob("*.*"):
        if f.suffix.lower() not in {".jpg",".jpeg",".png",".webp"}:
            continue
        try:
            data = f.read_bytes()
            if safe_write(data, f.stem, "earlier-extract"):
                n_new += 1
        except Exception:
            pass
    print(f"  ~/Downloads/sweet-life-pdf-photos/: {n_new} new images")
    total_new += n_new

print(f"\nTotal NEW unique images extracted: {total_new} → {DEST}")
