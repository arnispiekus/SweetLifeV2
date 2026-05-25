import { createClient } from "@supabase/supabase-js";

// Cookieless anon client (public read) for booklet generation.
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

export interface BookletItem {
  name: string;
  description: string;
  price: number | null;
  image: string | null;
  allergens: string[];
  variants: { name: string; price: number | null }[];
}
export interface BookletSubsection {
  name: string;
  items: BookletItem[];
}
export interface BookletSection {
  slug: string;
  name: string;
  subsections: BookletSubsection[];
}
export interface BookletData {
  sections: BookletSection[];
  allergens: { code: string; name: string }[];
}

const EXCLUDED = new Set(["events-catering"]);

export async function getBookletData(): Promise<BookletData> {
  const supabase = publicClient();

  const [{ data: secData, error: secErr }, { data: algData }] = await Promise.all([
    supabase
      .from("sections")
      .select(
        `id, name, slug, display_order,
         subsections ( id, name, display_order,
           menu_items ( name, description, price, image_url, display_order,
             item_variants ( name, price ),
             item_allergens ( allergen_code ) ) )`,
      )
      .eq("is_active", true)
      .order("display_order"),
    supabase.from("allergens").select("code, name"),
  ]);

  if (secErr) throw new Error(`Booklet load failed: ${secErr.message}`);

  type Raw = {
    name: string; slug: string; display_order: number;
    subsections: {
      name: string; display_order: number;
      menu_items: {
        name: string; description: string | null; price: number | null;
        image_url: string | null; display_order: number;
        item_variants: { name: string; price: number | null }[];
        item_allergens: { allergen_code: string }[];
      }[];
    }[];
  };

  const sections: BookletSection[] = ((secData ?? []) as Raw[])
    .filter((s) => !EXCLUDED.has(s.slug))
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      subsections: [...s.subsections]
        .sort((a, b) => a.display_order - b.display_order)
        .map((sub) => ({
          name: sub.name,
          items: [...sub.menu_items]
            .sort((a, b) => a.display_order - b.display_order)
            .map((i) => ({
              name: i.name,
              description: i.description ?? "",
              price: i.price,
              image: i.image_url ?? null,
              allergens: i.item_allergens.map((a) => a.allergen_code),
              variants: i.item_variants ?? [],
            })),
        }))
        .filter((sub) => sub.items.length > 0),
    }))
    .filter((s) => s.subsections.length > 0);

  return { sections, allergens: (algData ?? []) as { code: string; name: string }[] };
}

// ---- Rendering -----------------------------------------------------------

const ALLERGEN_COLORS: Record<string, string> = {
  G: "#C9962E", M: "#7CB342", Eg: "#E0A93B", N: "#8D6E63", Sy: "#7E57C2",
  Pe: "#A1672F", Mu: "#D4A017", Se: "#B98A3E", Cr: "#E07856", F: "#5B9BD5",
  Ce: "#8AAA4C", Lu: "#C08457", Ms: "#7A93A8", S02: "#9E9E9E",
};

// Section → decorative illustration(s) from /menu-art
const SECTION_ART: Record<string, string[]> = {
  "coffee-tea": ["cup-coffee.png", "mascot-cup.png"],
  "bakery-pastries": ["illo-croissant.png"],
  "breakfast-brunch": ["illo-acai.png"],
  "lunch": ["illo-sandwich.png", "illo-wrap.png"],
  "salads": ["illo-salad.png"],
  "cakes-cookies-bites": ["mascot-cookie.png"],
  "signature-drinks": ["mascot-boba.png"],
  "gourmet-lattes": ["mascot-cup.png"],
  "bingsu": ["mascot-matcha.png"],
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Route images through Next's optimizer so the PDF embeds small resized copies,
// not full-resolution source files. Width must be an allowed Next image size.
const optimg = (path: string, w: 128 | 256 | 384 | 640) =>
  `/_next/image?url=${encodeURIComponent(path)}&w=${w}&q=70`;

const money = (n: number | null) =>
  n == null ? "" : `£${n.toFixed(2)}`;

function dots(codes: string[]): string {
  if (!codes.length) return "";
  const ds = codes
    .map((c) => {
      const col = ALLERGEN_COLORS[c] ?? "#9a8975";
      return `<i class="ad" style="background:${col}">${esc(c)}</i>`;
    })
    .join("");
  return `<span class="dots">${ds}</span>`;
}

function variantNote(v: { name: string; price: number | null }[]): string {
  if (!v.length) return "";
  const parts = v.map(
    (x) => `${esc(x.name)}${x.price != null ? ` <b>${money(x.price)}</b>` : ""}`,
  );
  return `<div class="vr">${parts.join(" · ")}</div>`;
}

function itemRow(it: BookletItem): string {
  const thumb = it.image
    ? `<img class="thumb" src="${optimg(it.image, 128)}" alt="">`
    : "";
  return `
    <div class="item">
      ${thumb}
      <div class="itxt">
        <div class="line">
          <span class="nm">${esc(it.name)}${dots(it.allergens)}</span>
          <span class="pr">${money(it.price)}</span>
        </div>
        ${it.description ? `<div class="ds">${esc(it.description)}</div>` : ""}
        ${variantNote(it.variants)}
      </div>
    </div>`;
}

function sectionPage(sec: BookletSection): string {
  const artFiles = SECTION_ART[sec.slug] ?? [];
  const leftArt = artFiles[0]
    ? `<img class="hero-art" src="/menu-art/${artFiles[0]}" alt="">` : "";
  const rightArt = artFiles[1]
    ? `<img class="hero-art" src="/menu-art/${artFiles[1]}" alt="">` : "";
  const body = sec.subsections
    .map((sub) => {
      const showSubLabel = sec.subsections.length > 1;
      const head = showSubLabel ? `<div class="scn">${esc(sub.name)}</div>` : "";
      return head + sub.items.map(itemRow).join("");
    })
    .join("");
  return `
    <section class="section">
      <header class="sec-h">
        ${leftArt}
        <h2>${esc(sec.name)}</h2>
        ${rightArt}
      </header>
      <div class="cols">${body}</div>
    </section>`;
}

export function renderBookletHtml(data: BookletData, baseUrl = ""): string {
  const cover = `
    <section class="cover">
      <img src="/menu-art/cover.jpg" alt="Sweet Life Menu">
    </section>`;

  const sections = data.sections.map(sectionPage).join("");

  const legend = `
    <section class="page legend-page">
      <h2 class="legend-title">Allergens</h2>
      <div class="legend">
        ${data.allergens
          .map(
            (a) =>
              `<span><i class="ad" style="background:${
                ALLERGEN_COLORS[a.code] ?? "#9a8975"
              }">${esc(a.code)}</i>${esc(a.name)}</span>`,
          )
          .join("")}
      </div>
      <p class="legend-note">Please tell our team about any allergies before ordering. We handle nuts, gluten, dairy and other allergens in our kitchen.</p>
      <img class="legend-mascot" src="/menu-art/mascot-cup.png" alt="">
    </section>`;

  const base = baseUrl ? `<base href="${baseUrl}/">` : "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">${base}
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap');
@page { size: A5; margin: 12mm 11mm; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans'; color: #2c1d12; }
/* Full-bleed background painted on every printed page (covers @page margins too) */
.bg { position: fixed; inset: 0; z-index: -2;
  background: url('/menu-art/paper-bg.jpg') center center / cover no-repeat; }
.cover { break-after: page; }
.section { margin-top: 9mm; }
.section:first-of-type { margin-top: 0; }
.legend-page { break-before: page; }

/* Cover — full-bleed render of the original Canva cover */
.cover { width: 148mm; height: 210mm; margin: -12mm -11mm 0; overflow: hidden; }
.cover img { width: 148mm; height: 210mm; object-fit: cover; display: block; }

/* Section header */
.sec-h { display: flex; align-items: center; justify-content: center; gap: 12px; position: relative; margin-bottom: 12px; break-after: avoid; break-inside: avoid; }
.sec-h h2 { font-family: 'Playfair Display'; font-weight: 800; font-size: 28px; color: #2c1d12; margin: 0; }
.sec-h .art { display: flex; gap: 6px; }
.hero-art { height: 42px; width: auto; }
.sec-h::after { content: ""; position: absolute; left: 18%; right: 18%; bottom: -8px; height: 2px;
  background: linear-gradient(90deg, transparent, #C9892F, transparent); }

.cols { margin-top: 12px; column-count: 2; column-gap: 8mm; }
.scn { column-span: all; font-family: 'Playfair Display'; font-weight: 700; font-size: 12px; color: #B5651D; margin: 9px 0 5px; padding-bottom: 2px; border-bottom: 1px solid #ecd9bf; }
.scn:first-child { margin-top: 0; }

.item { display: flex; gap: 7px; align-items: flex-start; break-inside: avoid; margin: 0 0 6px; }
.thumb { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex: 0 0 auto; border: 1.5px solid #fff; box-shadow: 0 1px 4px rgba(120,80,30,.2); margin-top: 1px; }
.itxt { flex: 1; min-width: 0; }
.line { display: flex; align-items: baseline; gap: 4px; }
.nm { font-weight: 700; font-size: 9.5px; color: #2c1d12; line-height: 1.15; flex: 1; }
.dots { display: inline-flex; gap: 2px; margin-left: 2px; transform: translateY(-1px); flex: 0 0 auto; }
.ad { width: 8px; height: 8px; border-radius: 50%; font-size: 5px; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-style: normal; }
.pr { font-weight: 800; font-size: 9.5px; color: #C9892F; font-variant-numeric: tabular-nums; flex: 0 0 auto; }
.ds { font-size: 7px; color: #9a8062; line-height: 1.25; margin-top: 1px; font-style: italic;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.vr { font-size: 7px; color: #7d6549; margin-top: 1px; }
.vr b { color: #B5651D; }

/* Legend */
.legend-page { display: flex; flex-direction: column; }
.legend-title { font-family: 'Playfair Display'; font-weight: 800; font-size: 26px; text-align: center; color: #2c1d12; }
.legend { display: flex; flex-wrap: wrap; gap: 10px 20px; justify-content: center; margin: 18px 0; }
.legend span { font-size: 11px; color: #6B5E54; display: flex; align-items: center; gap: 6px; font-weight: 600; }
.legend .ad { width: 14px; height: 14px; font-size: 7px; }
.legend-note { font-size: 10px; color: #9a8062; text-align: center; max-width: 80%; margin: 8px auto; line-height: 1.5; }
.legend-mascot { width: 90px; height: auto; margin: 20px auto 0; display: block; }
</style></head>
<body>
<div class="bg"></div>
${cover}
${sections}
${legend}
</body></html>`;
}
