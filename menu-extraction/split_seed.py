#!/usr/bin/env python3
"""Split seed.sql into smaller .sql batches that can be sent through the
Supabase MCP one at a time. Each batch is a complete, standalone INSERT
(or pre-amble) — order matters, run them in numeric order.
"""
import re
from pathlib import Path

HERE = Path(__file__).parent
SRC = (HERE / "seed.sql").read_text()
OUT_DIR = HERE / "seed_batches"
OUT_DIR.mkdir(exist_ok=True)

# Strip BEGIN/COMMIT — each batch will be its own implicit transaction
SRC = re.sub(r"^\s*BEGIN;\s*$", "", SRC, flags=re.M)
SRC = re.sub(r"^\s*COMMIT;\s*$", "", SRC, flags=re.M)

# Split on terminating semicolons followed by blank lines.
# Each "statement" is either the TRUNCATE or a complete INSERT block.
statements: list[str] = []
buf: list[str] = []
for line in SRC.splitlines():
    buf.append(line)
    if line.rstrip().endswith(";") and (not line.lstrip().startswith("--")):
        stmt = "\n".join(buf).strip()
        if stmt:
            statements.append(stmt)
        buf = []

print(f"Parsed {len(statements)} top-level statements")

def split_large_insert(stmt: str, max_bytes: int = 50_000) -> list[str]:
    """If an INSERT ... VALUES (...), (...), ...; is bigger than max_bytes,
    break it into multiple smaller INSERTs with the same header."""
    if len(stmt) <= max_bytes:
        return [stmt]

    m = re.match(r"(.*?VALUES\s*)\n(.*);\s*$", stmt, flags=re.S | re.I)
    if not m:
        return [stmt]
    header, body = m.group(1).strip(), m.group(2).strip()

    # Split body into VALUE tuples by top-level commas. Tuples start with `(`
    # at start of a line and end with `)`. Easy split: each row in our generator
    # is on its own line and ends with either `,` or `;`. We can split on `,\n`.
    rows = re.split(r",\n(?=\s*\()", body)
    chunks: list[str] = []
    cur: list[str] = []
    cur_len = len(header) + 4
    for row in rows:
        if cur and cur_len + len(row) + 2 > max_bytes:
            chunks.append(header + "\n" + ",\n".join(cur) + ";")
            cur = [row]
            cur_len = len(header) + len(row) + 4
        else:
            cur.append(row)
            cur_len += len(row) + 2
    if cur:
        chunks.append(header + "\n" + ",\n".join(cur) + ";")
    return chunks


# Expand large INSERTs first
expanded: list[str] = []
for s in statements:
    expanded.extend(split_large_insert(s))
print(f"After splitting large inserts: {len(expanded)} statements")

# Group statements into batches of <= TARGET_BYTES each, never splitting a single statement.
TARGET = 60_000
batches: list[list[str]] = [[]]
sizes: list[int] = [0]
for s in expanded:
    if sizes[-1] + len(s) > TARGET and batches[-1]:
        batches.append([])
        sizes.append(0)
    batches[-1].append(s)
    sizes[-1] += len(s) + 2

for path in OUT_DIR.glob("*.sql"):
    path.unlink()

for i, group in enumerate(batches, start=1):
    out = OUT_DIR / f"batch_{i:02d}.sql"
    out.write_text("\n\n".join(group) + "\n")
    print(f"  batch_{i:02d}.sql  {out.stat().st_size:>7,} bytes  ({len(group)} statements)")
