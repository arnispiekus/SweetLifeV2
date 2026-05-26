"""Extract embedded base64 images from Canva SVG exports.

For each SVG (per page), pull out every <image href="data:image/...;base64,..."> embed.
Save with naming: {page}-{index}-{nearby_text_slug}.{ext}.

Also extract nearby <text> elements so we can auto-label by spatial proximity.

Usage: extract_svg.py <svg-dir> <out-dir>
"""
import base64
import json
import re
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {"svg": "http://www.w3.org/2000/svg", "xlink": "http://www.w3.org/1999/xlink"}

def slugify(s: str, max_len: int = 40) -> str:
    s = re.sub(r"[^a-zA-Z0-9 ]+", "", s).strip().replace(" ", "-").lower()
    return s[:max_len] or "no-text"

def find_nearest_text(image_attrib: dict, texts: list[tuple[float, float, str]]) -> str:
    try:
        ix = float(image_attrib.get("x", 0))
        iy = float(image_attrib.get("y", 0))
        iw = float(image_attrib.get("width", 0))
        ih = float(image_attrib.get("height", 0))
        cx, cy = ix + iw / 2, iy + ih / 2
    except (TypeError, ValueError):
        return ""
    best, best_d = "", 1e18
    for tx, ty, txt in texts:
        if len(txt.strip()) < 3:
            continue
        d = (tx - cx) ** 2 + (ty - cy) ** 2
        if d < best_d:
            best_d, best = d, txt
    return best.strip()

def extract(svg_path: Path, out_dir: Path) -> int:
    try:
        tree = ET.parse(svg_path)
    except ET.ParseError:
        return 0
    root = tree.getroot()

    # Collect text positions
    texts: list[tuple[float, float, str]] = []
    for t in root.iter():
        if not t.tag.endswith("}text"):
            continue
        try:
            x = float(t.attrib.get("x", 0))
            y = float(t.attrib.get("y", 0))
        except (TypeError, ValueError):
            x = y = 0.0
        txt = "".join(t.itertext()).strip()
        if txt:
            texts.append((x, y, txt))

    count = 0
    page_num = svg_path.stem
    for img in root.iter():
        if not img.tag.endswith("}image"):
            continue
        href = (img.attrib.get("{http://www.w3.org/1999/xlink}href")
                or img.attrib.get("href") or "")
        m = re.match(r"data:image/(\w+);base64,(.+)$", href, re.S)
        if not m:
            continue
        ext, b64 = m.group(1).lower(), m.group(2)
        try:
            data = base64.b64decode(b64)
        except Exception:
            continue
        nearby = find_nearest_text(img.attrib, texts)
        slug = slugify(nearby) if nearby else f"img{count}"
        # Skip tiny icons
        if len(data) < 8 * 1024:   # < 8KB likely an icon, skip
            continue
        out_dir.mkdir(parents=True, exist_ok=True)
        out_name = f"{page_num}-{count:02d}-{slug}.{ext}"
        (out_dir / out_name).write_bytes(data)
        count += 1
    return count

def main():
    svg_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    total = 0
    for svg in sorted(svg_dir.glob("*.svg")):
        n = extract(svg, out_dir)
        print(f"  {svg.name}: {n} images")
        total += n
    print(f"\nTotal: {total} images → {out_dir}")

if __name__ == "__main__":
    main()
