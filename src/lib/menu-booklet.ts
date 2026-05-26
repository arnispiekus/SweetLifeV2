import { createClient } from "@supabase/supabase-js";

// Editorial-café 18-page booklet, modelled on the Claude Design handoff.
// Page size matches the design's native 1240x1754. Cover is page 1; sections
// 2-18 are templated from Supabase data; static brand copy is inlined.

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

// ---- Types ---------------------------------------------------------------

export interface BookletItem {
  name: string;
  description: string;
  price: number | null;
  image: string | null;
  tags: string[];
  allergens: string[];
  variants: { name: string; price: number | null }[];
}
export interface BookletSubsection { slug: string; name: string; items: BookletItem[]; }
export interface BookletSection { slug: string; name: string; subsections: BookletSubsection[]; }
export interface BookletData {
  sections: BookletSection[];
  bySlug: Record<string, BookletSection>;
  allergens: { code: string; name: string }[];
}

// ---- Data ----------------------------------------------------------------

export async function getBookletData(): Promise<BookletData> {
  const supabase = publicClient();
  const [{ data: secData, error }, { data: algData }] = await Promise.all([
    supabase.from("sections").select(
      `id, name, slug, display_order,
       subsections ( id, name, slug, display_order,
         menu_items ( name, description, price, image_url, tags, display_order,
           item_variants ( name, price ),
           item_allergens ( allergen_code ) ) )`,
    ).eq("is_active", true)
      .is("subsections.menu_items.seasonal", null)
      .contains("subsections.menu_items.available_at", ["newry"])
      .order("display_order"),
    supabase.from("allergens").select("code, name"),
  ]);
  if (error) throw new Error(`Booklet load failed: ${error.message}`);

  type Raw = {
    name: string; slug: string; display_order: number;
    subsections: {
      name: string; slug: string; display_order: number;
      menu_items: {
        name: string; description: string | null; price: number | null;
        image_url: string | null; tags: string[] | null; display_order: number;
        item_variants: { name: string; price: number | null }[];
        item_allergens: { allergen_code: string }[];
      }[];
    }[];
  };

  const sections: BookletSection[] = ((secData ?? []) as Raw[]).map((s) => ({
    slug: s.slug, name: s.name,
    subsections: [...s.subsections].sort((a, b) => a.display_order - b.display_order).map((sub) => ({
      slug: sub.slug, name: sub.name,
      items: [...sub.menu_items].sort((a, b) => a.display_order - b.display_order).map((i) => ({
        name: i.name, description: i.description ?? "", price: i.price,
        image: i.image_url ?? null, tags: i.tags ?? [],
        allergens: i.item_allergens.map((a) => a.allergen_code),
        variants: i.item_variants ?? [],
      })),
    })),
  }));

  const bySlug: Record<string, BookletSection> = {};
  for (const s of sections) bySlug[s.slug] = s;
  return { sections, bySlug, allergens: (algData ?? []) as { code: string; name: string }[] };
}

// ---- Helpers -------------------------------------------------------------

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const money = (n: number | null) => (n == null ? "" : `£${n.toFixed(2)}`);

const findSection = (data: BookletData, slug: string) => data.bySlug[slug];
const findSub = (sec: BookletSection | undefined, slug: string) =>
  sec?.subsections.find((s) => s.slug === slug);
const findItem = (sec: BookletSection | undefined, name: string) => {
  if (!sec) return undefined;
  const target = name.toLowerCase().trim();
  for (const sub of sec.subsections) {
    const hit = sub.items.find((i) => i.name.toLowerCase().trim() === target);
    if (hit) return hit;
  }
  return undefined;
};

function parseTags(raw: string): { name: string; tags: { label: string; cls: string }[] } {
  const tags: { label: string; cls: string }[] = [];
  let n = raw;
  const re = /\s*\((K|GF\*?|V\*?|\*V)\)/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const t = m[1];
    let cls = "";
    if (t === "K") cls = "berry";
    else if (t.startsWith("V") || t === "*V") cls = "olive";
    tags.push({ label: t.replace("*V", "V*"), cls });
  }
  n = n.replace(re, "").replace(/\s{2,}/g, " ").trim();
  return { name: n, tags };
}

function badges(codes: string[]): string {
  if (!codes.length) return "";
  const cls = (c: string) => (c === "S02" ? "S" : c);
  const text = (c: string) => (c === "S02" ? "SO₂" : c);
  return `<span class="badges">${codes.map((c) => `<span class="b ${cls(c)}">${text(c)}</span>`).join("")}</span>`;
}

function tagChips(tags: { label: string; cls: string }[]): string {
  if (!tags.length) return "";
  return tags.map((t) => `<span class="tag${t.cls ? " " + t.cls : ""}">${esc(t.label)}</span>`).join(" ");
}

function nameMarkup(rawName: string, allergens: string[]): string {
  const { name, tags } = parseTags(rawName);
  return `${esc(name)}${tags.length ? " " + tagChips(tags) : ""}${badges(allergens)}`;
}

function descMarkup(desc: string): string {
  if (!desc) return "";
  return esc(desc).replace(/(£\d+(?:\.\d{2})?)/g, "<strong>$1</strong>");
}

function itemRow(it: BookletItem, compact = false): string {
  const variantNote = it.variants.length
    ? `<em class="alt">${it.variants
        .map((v) => `${esc(v.name)}${v.price != null ? ` <strong>${money(v.price)}</strong>` : ""}`)
        .join(" · ")}</em>`
    : "";
  const descBits = [it.description ? descMarkup(it.description) : "", variantNote].filter(Boolean).join(" ");
  return `
    <div class="item ${compact ? "compact" : ""}">
      <div class="row">
        <span class="name">${nameMarkup(it.name, it.allergens)}</span>
        <span class="dots"></span>
        <span class="price">${money(it.price)}</span>
      </div>
      ${descBits ? `<div class="desc">${descBits}</div>` : ""}
    </div>`;
}

function chip(label: string, sub?: string, dark = false): string {
  return `<div class="chip${dark ? " dark" : ""}">${esc(label)}${sub ? `<span class="tea">${esc(sub)}</span>` : ""}</div>`;
}

function pageWrap(content: string, foot: string | null, klass = "", padOverride: string | null = null): string {
  const pad = padOverride ? ` style="padding:${padOverride};"` : "";
  return `
    <section class="page ${klass}"${pad}>
      ${content}
      <div class="corners-bottom"></div>
      ${foot ? `<div class="pagefoot">${foot}</div>` : ""}
    </section>`;
}

function foot(page: number, total = 18) {
  return `<span class="mark">Sweet Life</span><span>${String(page).padStart(2, "0")} / ${total}</span>`;
}

function headRow(glyphLeft: string, title: string, glyphRight: string): string {
  return `
    <div class="head-row">
      <span class="glyph">${esc(glyphLeft)}</span>
      <h2 class="section-title">${esc(title)}</h2>
      <span class="glyph">${esc(glyphRight)}</span>
    </div>
    <div class="section-rule"><span class="line"></span><span class="diamond"></span><span class="line"></span></div>`;
}

function eyebrowTitle(eyebrow: string, title: string): string {
  return `
    <div class="section-eyebrow">${esc(eyebrow)}</div>
    <h2 class="section-title">${esc(title)}</h2>
    <div class="section-rule"><span class="line"></span><span class="diamond"></span><span class="line"></span></div>`;
}

// ---- Page renderers ------------------------------------------------------

function renderCover(): string {
  return pageWrap(
    `
    <div class="cover">
      <div class="est">Est. 2021 · Newry</div>
      <h1 class="wordmark">Sweet Life</h1>
      <div class="tag">— café &amp; kitchen —</div>
      <div class="menu-word">Menu</div>
      <div class="place">Coffee · Brunch · Bakery · Bingsu</div>
      <div style="display:flex; align-items:center; gap:60px; margin-top:80px;">
        <div style="text-align:center;">
          <div style="font-family:'Fraunces',serif; font-style:italic; font-size:32px; margin-bottom:14px;">Scan to order</div>
          <div class="qr" id="qr"></div>
        </div>
        <div style="text-align:center;">
          <div style="font-family:'Fraunces',serif; font-style:italic; font-size:32px; margin-bottom:14px;">or follow us</div>
          <div class="socials" style="margin-top:0; flex-direction:column; gap:14px;">
            <div class="social" style="flex-direction:row; gap:14px;"><span class="ic">f</span><span>@sweet.life.ireland</span></div>
            <div class="social" style="flex-direction:row; gap:14px;"><span class="ic">t</span><span>@sweet_life_ireland</span></div>
            <div class="social" style="flex-direction:row; gap:14px;"><span class="ic">G</span><span>Leave us a Google review</span></div>
          </div>
        </div>
      </div>
    </div>`,
    null,
    "cream-deep cover-page",
    "60px",
  );
}

function renderContents(): string {
  const items: [string, string][] = [
    ["New on the Menu", "03"],
    ["Breakfast & Brunch", "04"],
    ["Coffee & Tea", "05"],
    ["Gourmet Lattes", "06"],
    ["Signature Drinks", "07"],
    ["Shakes, Smoothies & Frappés", "08"],
    ["Bakery & Pastries", "09"],
    ["Lunch", "10"],
    ["Salads", "11"],
    ["Create Your Own", "12"],
    ["Cakes, Cookies & Bites", "13"],
    ["Soft-Serve Ice-cream", "14"],
    ["Bingsu — Korean Shaved Ice", "15"],
    ["Keto, Vegan & Gluten-Free", "16"],
    ["Sushi · Pre-Order Only", "17"],
    ["Allergen Information", "18"],
  ];
  return pageWrap(
    `
    ${eyebrowTitle("A quick guide", "Contents")}
    <div class="toc">
      ${items
        .map(
          ([t, p], i) => `
        <div class="toc-item">
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
          <span class="ttl">${esc(t)}</span>
          <span class="pg">${esc(p)}</span>
        </div>`,
        )
        .join("")}
    </div>
    <p class="note" style="margin-top:50px;">Look for the coloured circles next to each item — they flag the common allergens present. See p.18 for the full key.</p>`,
    foot(2),
  );
}

function renderNewOnMenu(data: BookletData): string {
  const curated = [
    "Prosciutto Ham & Feta Cheese Baguette",
    "Sourdough Pizza",
    "Chicken Curry (GF)",
    "Creamy Matcha",
  ];
  const all: BookletItem[] = [];
  for (const name of curated) {
    for (const sec of data.sections) {
      const hit = findItem(sec, name);
      if (hit) { all.push(hit); break; }
    }
  }
  const features = all.slice(0, 3);
  const list = all;
  return pageWrap(
    `
    ${eyebrowTitle("Just landed", "New on the Menu")}
    <div class="feature-row">
      ${features
        .map(
          (it) => `
        <div class="feature-card">
          <div class="ph">product shot</div>
          <div class="nm">${esc(parseTags(it.name).name)}</div>
          <div class="pr">${money(it.price)}</div>
        </div>`,
        )
        .join("")}
    </div>
    <div class="menu-list" style="margin-top:38px;">
      ${list.map((i) => itemRow(i, false)).join("")}
    </div>
    <div class="banner" style="margin-top:60px;">
      <div class="big">Events<br/>&amp; Catering</div>
      <div class="small">Perfect for parties, meetings &amp; gatherings. Platters of mini sandwiches, sushi, snacks &amp; finger foods. Menus tailored to your event — just tell us what you need.</div>
    </div>`,
    foot(3),
  );
}

function renderBreakfast(data: BookletData): string {
  const sec = findSection(data, "breakfast-brunch");
  const mainSub = findSub(sec, "breakfast-brunch");
  const acai = findItem(sec, "Acai Granola Bowl");
  const items = mainSub?.items ?? [];
  return pageWrap(
    `
    ${headRow("B", "Breakfast & Brunch", "B")}
    <div class="menu-list" style="gap:10px;">
      ${items.map((i) => itemRow(i, true)).join("")}
    </div>
    ${
      acai
        ? `
    <div class="acai-card" style="margin-top:14px;">
      <div class="price-tag">${money(acai.price).replace(".00", "")}</div>
      <h3>Açai Granola Bowl</h3>
      <div class="lead">Pick one from each list · topped with banana, berries &amp; whipped cream</div>
      <div>
        <h4>Base</h4>
        <ul><li>Chia Pudding</li><li>Maple Syrup &amp; Yogurt</li><li>Mango Yogurt</li></ul>
      </div>
      <div>
        <h4>Spread</h4>
        <ul><li>Peanut Butter</li><li>Nutella</li><li>Biscoff</li></ul>
      </div>
      <div>
        <h4>Crunch</h4>
        <ul><li>Almonds · Coconut Flakes</li><li>Rice Krispies · Kit Kat</li><li>Lotus Crumbs · Oreo Crumbs</li></ul>
      </div>
    </div>`
        : ""
    }`,
    foot(4),
  );
}

function renderCoffeeTea(data: BookletData): string {
  const sec = findSection(data, "coffee-tea");
  const coffee = findSub(sec, "coffee")?.items ?? [];
  const tea = findSub(sec, "tea")?.items ?? [];
  const matcha = findSub(sec, "matcha")?.items ?? [];
  return pageWrap(
    `
    ${headRow("C", "Coffee & Tea", "T")}
    <div class="two-col">
      <div>
        <div class="group-h">Coffee <span class="sub">*Iced Coffee +£0.20</span></div>
        <div class="menu-list">${coffee.map((i) => itemRow(i, true)).join("")}</div>
      </div>
      <div>
        <div class="group-h">Tea</div>
        <div class="menu-list">${tea.map((i) => itemRow(i, true)).join("")}</div>
        <div class="group-h">Matcha</div>
        <div class="menu-list">${matcha.map((i) => itemRow(i, true)).join("")}</div>
        <div class="group-h">Extras</div>
        <div class="menu-list">
          <div class="item compact"><div class="row"><span class="name">Decaf</span><span class="dots"></span><span class="price">£0.30</span></div>
            <div class="desc">Decaf coffee or tea.</div></div>
          <div class="item compact"><div class="row"><span class="name">Change Milk</span><span class="dots"></span><span class="price">£0.50</span></div>
            <div class="desc">Soya · Oat · Coconut · Almond · Semi-Skimmed (free).</div></div>
          <div class="item compact"><div class="row"><span class="name">Add Syrup</span><span class="dots"></span><span class="price">£0.50</span></div>
            <div class="desc">Hazelnut · Vanilla · Caramel · Salted Caramel · Chocolate · Caramelised Peanut · Blueberry · Strawberry · Cherry · Cinnamon · Pumpkin Spiced · Irish Cream · Pistachio. <em class="alt">Sugar-free: Caramel, Hazelnut, Vanilla.</em></div></div>
        </div>
      </div>
    </div>`,
    foot(5),
  );
}

function renderGourmetLattes(data: BookletData): string {
  const sec = findSection(data, "gourmet-lattes");
  const blends = findSub(sec, "lattes-coffee-blends")?.items ?? [];
  const hotChoc = findSub(sec, "hot-chocolates")?.items ?? [];
  const inTier = (low: number, high: number) =>
    blends.filter((i) => i.price != null && i.price >= low && i.price <= high);
  const t1 = inTier(4.5, 4.5);
  const t2 = inTier(5.0, 5.0);
  const t3 = inTier(5.5, 5.5);
  const tier = (label: string, price: string, items: BookletItem[], sub = ""): string => `
    <div class="flavor-block">
      <div class="flavor-h">
        <span class="lbl">${esc(label)}</span>
        <span class="price">${esc(price)}</span>
        ${sub ? `<span class="sub">${esc(sub)}</span>` : ""}
      </div>
      <div class="flavor-grid cols-4">
        ${items.map((i) => chip(parseTags(i.name).name)).join("")}
      </div>
    </div>`;
  return pageWrap(
    `
    ${headRow("G", "Gourmet Lattes", "L")}
    ${tier("Lattes & Coffee Blends", "£4.50", t1, "*Iced coffee +£0.20")}
    ${tier("Signature Lattes", "£5.00", t2)}
    ${tier("Premium Lattes", "£5.50", t3)}
    <div class="flavor-block">
      <div class="flavor-h"><span class="lbl">Hot Chocolates</span></div>
      <div class="flavor-grid cols-4">
        ${hotChoc
          .map((i) => `<div class="chip">${esc(parseTags(i.name).name)} <span class="tea assam">${money(i.price)}</span></div>`)
          .join("")}
      </div>
    </div>
    <p class="note">Every gourmet latte can be served hot or iced. Plant milk available — see Extras.</p>`,
    foot(6),
  );
}

function renderSignatureDrinks(data: BookletData): string {
  const sec = findSection(data, "signature-drinks");
  const milkTea = findSub(sec, "milk-tea")?.items ?? [];
  const fruitTea = findSub(sec, "fruit-tea")?.items ?? [];
  const refreshing = findSub(sec, "refreshing-drinks")?.items ?? [];
  const fruitChip = (it: BookletItem) => {
    const n = parseTags(it.name).name;
    const m = n.match(/^(.+?)\s+(Assam Black Tea|Jasmine Green Tea|Tea)$/i);
    if (m) {
      const flavor = m[1];
      const base = m[2].replace(/\sTea$/i, "");
      const cls = /Assam/i.test(base) ? " assam" : "";
      return `<div class="chip">${esc(flavor)} <span class="tea${cls}">${esc(base)}</span></div>`;
    }
    return chip(n);
  };
  return pageWrap(
    `
    ${eyebrowTitle("Boba available · +£1.00", "Signature Drinks")}
    <div class="flavor-block">
      <div class="flavor-h"><span class="lbl">Milk Tea</span><span class="price">£4.50</span><span class="sub">Cold or Hot · +£0.20 Hot</span></div>
      <div class="flavor-grid">
        ${milkTea.map((i) => chip(parseTags(i.name).name.replace(/ Milk Tea$/, ""))).join("")}
      </div>
    </div>
    <div class="flavor-block">
      <div class="flavor-h"><span class="lbl">Fruit Tea</span><span class="price">£4.50</span><span class="sub">Still or Sparkling · Cold or Hot · freshly brewed</span></div>
      <div class="flavor-grid">${fruitTea.map(fruitChip).join("")}</div>
    </div>
    <div class="flavor-block">
      <div class="flavor-h"><span class="lbl">Refreshing Drinks</span><span class="price">£4.50</span></div>
      <div class="flavor-grid cols-4">
        ${refreshing.map((i) => chip(parseTags(i.name).name)).join("")}
      </div>
    </div>
    <p class="note">Add boba, popping pearls, or lychee jelly to any drink — <strong>+£1.00</strong>.</p>`,
    foot(7),
  );
}

function renderShakes(data: BookletData): string {
  const sec = findSection(data, "signature-drinks");
  const smoothies = findSub(sec, "smoothies")?.items ?? [];
  const frappes = findSub(sec, "frappes")?.items ?? [];
  const milkshakes = findSub(sec, "milkshakes")?.items ?? [];
  const protein = findSub(sec, "protein-shakes")?.items ?? [];
  const strip = (s: string) =>
    s.replace(/\s(Smoothie|Frappe|Milkshake|Protein Shake)$/i, "");
  return pageWrap(
    `
    ${eyebrowTitle("Toppings available", "Shakes, Smoothies & Frappés")}
    <div class="flavor-block">
      <div class="flavor-h"><span class="lbl">Smoothie</span><span class="price">£5.00</span><span class="sub">Cold 16oz · made with apple juice</span></div>
      <div class="flavor-grid">${smoothies.map((i) => chip(strip(parseTags(i.name).name))).join("")}</div>
    </div>
    <div class="flavor-block">
      <div class="flavor-h"><span class="lbl">Frappé</span><span class="price">£6.00</span><span class="sub">Cold 16oz</span></div>
      <div class="flavor-grid">${frappes.map((i) => chip(strip(parseTags(i.name).name))).join("")}</div>
    </div>
    <div class="flavor-block">
      <div class="flavor-h"><span class="lbl">Milkshake</span><span class="price">£5.00</span><span class="sub">Cold 16oz</span></div>
      <div class="flavor-grid">${milkshakes.map((i) => chip(strip(parseTags(i.name).name))).join("")}</div>
    </div>
    <div class="flavor-block">
      <div class="flavor-h"><span class="lbl">Protein Shake</span><span class="price">£7.00</span><span class="sub">Cold 16oz</span></div>
      <div class="flavor-grid cols-5">${protein.map((i) => chip(strip(parseTags(i.name).name))).join("")}</div>
    </div>`,
    foot(8),
  );
}

function renderBakery(data: BookletData): string {
  const sec = findSection(data, "bakery-pastries");
  const scones = findSub(sec, "scones")?.items ?? [];
  const croissants = findSub(sec, "croissants")?.items ?? [];
  const other = findSub(sec, "other-pastries")?.items ?? [];
  const tight = (s: string) =>
    s.replace(/\s+(Scone|Croissant)$/i, "");
  return pageWrap(
    `
    ${headRow("B", "Bakery & Pastries", "P")}
    <div class="two-col">
      <div>
        <div class="group-h">Scones <span class="sub">buttery, crumbly — perfect on its own or with spreads</span></div>
        <div class="menu-list">
          ${scones.map((i) => {
            const t = parseTags(i.name);
            const cleaned = tight(t.name);
            return `<div class="item compact"><div class="row"><span class="name">${esc(cleaned)} ${tagChips(t.tags)}${badges(i.allergens)}</span><span class="dots"></span><span class="price">${money(i.price)}</span></div></div>`;
          }).join("")}
        </div>
        <div class="group-h">Croissants <span class="sub">light, flaky — crisp outside, soft and buttery inside</span></div>
        <div class="menu-list">
          ${croissants.map((i) => {
            const t = parseTags(i.name);
            const cleaned = tight(t.name);
            return `<div class="item compact"><div class="row"><span class="name">${esc(cleaned)} ${tagChips(t.tags)}${badges(i.allergens)}</span><span class="dots"></span><span class="price">${money(i.price)}</span></div></div>`;
          }).join("")}
        </div>
      </div>
      <div>
        <div class="group-h">Daily Bakes</div>
        <div class="menu-list">${other.map((i) => itemRow(i, true)).join("")}</div>
        <div class="banner" style="margin-top:60px;">
          <div class="big">Ramen!</div>
          <div class="small">Ask staff about our daily ramen — slow-cooked broth, fresh noodles, the works. See <em>Lunch</em> for our standard bowl.</div>
        </div>
      </div>
    </div>`,
    foot(9),
  );
}

function renderLunch(data: BookletData): string {
  const sec = findSection(data, "lunch");
  const mains = findSub(sec, "mains")?.items ?? [];
  return pageWrap(
    `
    ${headRow("L", "Lunch", "L")}
    <div class="menu-list">
      ${mains.map((i) => itemRow(i, true)).join("")}
    </div>
    <p class="note small">*If you require vegetarian options, please inform us — we can exclude eggs, mayo or meat. Items with bread, bagels, baps or waffles can be swapped for gluten-free alternatives upon request.</p>`,
    foot(10),
  );
}

function renderSalads(data: BookletData): string {
  const sec = findSection(data, "salads");
  const items = sec?.subsections.flatMap((s) => s.items) ?? [];
  return pageWrap(
    `
    ${headRow("S", "Salads", "S")}
    <div class="menu-list">${items.map((i) => itemRow(i, false)).join("")}</div>
    <div class="photo-strip" style="margin-top:60px;">
      <div class="ph">salad bowl</div>
      <div class="ph">salad bowl</div>
      <div class="ph">salad bowl</div>
    </div>`,
    foot(11),
  );
}

function renderCreateYourOwn(data: BookletData): string {
  const sec = findSection(data, "lunch");
  const bases = findSub(sec, "create-your-own")?.items ?? [];
  return pageWrap(
    `
    ${headRow("+", "Create Your Own", "+")}
    <div class="group-h">Base Options</div>
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px 30px;">
      ${bases
        .map((i) => `<div class="item compact"><div class="row"><span class="name">${esc(parseTags(i.name).name)}</span><span class="dots"></span><span class="price">${money(i.price)}</span></div></div>`)
        .join("")}
    </div>
    <p class="note small" style="margin:14px 0 0;">Items containing bread, bagels, baps or waffles can be swapped for gluten-free (<strong>£0.70</strong>) or sourdough (<strong>£0.50</strong>). Just ask.</p>
    <div class="full-bleed-bottom">
      <h3>Choose your toppings</h3>
      <div class="build-grid" style="margin-top:24px;">
        <div>
          <h4>Protein <span style="color:#bba78c; font-size:14px; font-style:normal; font-weight:400;">(max 2)</span></h4>
          <ul>
            <li>Egg</li><li>Chicken</li><li>Chicken Tikka</li><li>Crispy Chicken</li>
            <li>Ham</li><li>Bacon</li><li>Slow Cooked Beef</li><li>Pepperoni</li>
            <li>Tuna</li><li>Sausage</li><li>Smoked Salmon <span style="color:#e6a98a;">(+£0.50)</span></li>
          </ul>
        </div>
        <div>
          <h4>Cheese</h4>
          <ul><li>Mozzarella</li><li>Cheddar</li><li>Parmesan</li><li>Blue Cheese</li><li>Cream Cheese</li></ul>
          <h4 style="margin-top:18px;">Vegan <span style="color:#bba78c; font-size:14px; font-style:normal; font-weight:400;">(+£2.00)</span></h4>
          <ul><li>Sausage</li><li>Mince</li><li>¼ Pounder</li></ul>
        </div>
        <div>
          <h4>Salad</h4>
          <ul>
            <li>Fried Peppers</li><li>Fresh Peppers</li><li>Tomatoes</li><li>Spinach</li>
            <li>Cucumber</li><li>Pickles</li><li>Sweetcorn</li><li>Red Onion</li>
            <li>Jalapeño</li><li>Mushrooms</li><li>Avocado</li><li>Olives</li>
          </ul>
        </div>
        <div>
          <h4>Sauce</h4>
          <ul>
            <li>Mayo</li><li>Burger Sauce</li><li>BBQ</li><li>Teriyaki</li>
            <li>Basil Pesto</li><li>Ketchup</li><li>Tabasco</li><li>Peri-Peri</li>
            <li>Carbonara</li><li>Sweet Chilli</li><li>Baconnaise</li><li>Firecracker</li><li>Salsa</li>
          </ul>
        </div>
      </div>
    </div>`,
    foot(12),
  );
}

function renderCakes(data: BookletData): string {
  const sec = findSection(data, "cakes-cookies-bites");
  const cakes = findSub(sec, "cakes-pies")?.items ?? [];
  const cookies = findSub(sec, "cookies-small-bites")?.items ?? [];
  const iceAdd = findSub(sec, "add-ice-cream")?.items ?? [];
  const mid = Math.ceil(cakes.length / 2);
  const left = cakes.slice(0, mid);
  const right = cakes.slice(mid);
  return pageWrap(
    `
    ${headRow("C", "Cakes, Cookies & Bites", "B")}
    <div class="two-col">
      <div>
        <div class="group-h">Cakes &amp; Pies</div>
        <div class="menu-list">${left.map((i) => itemRow(i, true)).join("")}</div>
      </div>
      <div>
        <div class="group-h">More Cakes</div>
        <div class="menu-list">${right.map((i) => itemRow(i, true)).join("")}</div>
        <div class="group-h">Cookies &amp; Small Bites</div>
        <div class="menu-list">${cookies.map((i) => itemRow(i, true)).join("")}</div>
        <div class="group-h">Add Ice-cream</div>
        <div class="menu-list">${iceAdd.map((i) => itemRow(i, true)).join("")}</div>
        <div style="margin-top:30px; padding:24px; background:var(--paper-warm); border-radius:6px;">
          <div style="font-family:'Fraunces',serif; font-style:italic; font-size:28px; color:var(--terra); margin-bottom:8px;">Cake of the week</div>
          <div style="font-size:18px; color:var(--ink-soft);">Ask staff what we've baked today — limited slices, gone by the afternoon.</div>
        </div>
      </div>
    </div>`,
    foot(13),
  );
}

function renderSoftServe(data: BookletData): string {
  const sec = findSection(data, "cakes-cookies-bites");
  const ss = findSub(sec, "soft-serve-ice-cream")?.items ?? [];
  const toppings: [string, string][] = [
    ["Pistachio Powder", "£0.50"], ["Coconut Flakes", "£0.30"],
    ["Roasted Almonds", "£0.40"], ["Granola", "£0.30"],
    ["Oreo Crumbs", "£0.30"], ["Marshmallows", "£0.30"],
    ["Kit Kat Crumbs", "£0.30"], ["Rainbow Sprinkles", "£0.20"],
    ["Biscoff Lotus", "£0.30"], ["Chocolate Sprinkles", "£0.20"],
    ["Flake", "£0.20"],
  ];
  const sauces = ["Strawberry","Pistachio","Mango","Bueno","Passionfruit","Bubblegum","Chocolate","White Chocolate","Oreo","Caramel"];
  return pageWrap(
    `
    ${headRow("S", "Soft-Serve Ice-cream", "S")}
    <p class="center" style="font-family:'Fraunces',serif; font-style:italic; font-size:30px; margin:0 0 30px;">Fresh, homemade soft-serve. Ask for flavours.</p>
    <div class="menu-list" style="max-width:760px; margin:0 auto;">
      ${ss.map((i) => itemRow(i, false)).join("")}
    </div>
    <div class="two-col" style="margin-top:50px;">
      <div>
        <div class="group-h">Toppings</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; font-size:18px; line-height:1.5;">
          ${toppings.map(([n, p]) => `<div>${esc(n)} <span style="color:var(--terra);">${esc(p)}</span></div>`).join("")}
        </div>
      </div>
      <div>
        <div class="group-h">Sauces <span class="sub">free</span></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; font-size:18px; line-height:1.5;">
          ${sauces.map((s) => `<div>${esc(s)}</div>`).join("")}
        </div>
      </div>
    </div>
    <div class="banner" style="margin-top:auto;">
      <div class="big">Bingsu!</div>
      <div class="small">Korean shaved-ice dessert. See next page — small £6.50 · medium £7.50 · large £8.50. Dairy-free available.</div>
    </div>`,
    foot(14),
  );
}

function renderBingsuMore(data: BookletData): string {
  const bingsu = findSection(data, "bingsu");
  const gtoast = findSection(data, "golden-toast");
  const pancakes = findSection(data, "pancakes-waffles");
  const bingsuItems = bingsu?.subsections.flatMap((s) => s.items) ?? [];
  const gtoastItems = gtoast?.subsections.flatMap((s) => s.items) ?? [];
  const souffle = findSub(pancakes, "souffle-pancake")?.items ?? [];
  const american = findSub(pancakes, "american-pancake")?.items ?? [];
  const waffles = findSub(pancakes, "waffle")?.items ?? [];
  const STAFF_PICKS = new Set(["Taro Bingsu", "Berrylicious Bingsu", "S'more Golden Toast", "Choco Banana Souffle Pancake"]);
  const cleanFlavor = (n: string, suffix: RegExp) => n.replace(suffix, "").trim();
  const bingsuChip = (i: BookletItem) => {
    const star = STAFF_PICKS.has(i.name);
    return chip(cleanFlavor(parseTags(i.name).name, /\s*Bingsu$/i) + (star ? " ★" : ""), undefined, star);
  };
  const gtoastChip = (i: BookletItem) => {
    const star = STAFF_PICKS.has(i.name);
    return chip(cleanFlavor(parseTags(i.name).name, /\s*Golden Toast$/i) + (star ? " ★" : ""), undefined, star);
  };
  const souffleChip = (i: BookletItem) => {
    const star = STAFF_PICKS.has(i.name);
    return chip(cleanFlavor(parseTags(i.name).name, /\s*Souffle Pancake$/i) + (star ? " ★" : ""), undefined, star);
  };
  const americanChip = (i: BookletItem) =>
    chip(cleanFlavor(parseTags(i.name).name, /\s*American Pancake$/i));
  const waffleChip = (i: BookletItem) =>
    chip(cleanFlavor(parseTags(i.name).name, /\s*Waffle$/i));
  return pageWrap(
    `
    ${eyebrowTitle("Korean shaved-ice dessert", "Bingsu & More")}
    <div class="two-col" style="gap:36px 50px;">
      <div>
        <div class="group-h">Bingsu <span class="sub">small £6.50 · med £7.50 · large £8.50 · DF available</span></div>
        <div class="flavor-grid cols-3">${bingsuItems.map(bingsuChip).join("")}</div>
        <div class="group-h" style="margin-top:32px;">Golden Toast <span class="sub">crispy outside, soft inside · £15.00</span></div>
        <div class="flavor-grid cols-3">${gtoastItems.map(gtoastChip).join("")}</div>
      </div>
      <div>
        <div class="group-h">Soufflé Pancake <span class="sub">£12.00</span></div>
        <div class="flavor-grid cols-2" style="grid-template-columns:1fr 1fr;">${souffle.map(souffleChip).join("")}</div>
        <div class="group-h" style="margin-top:24px;">American Pancake <span class="sub">£10.00</span></div>
        <div class="flavor-grid cols-2" style="grid-template-columns:1fr 1fr;">${american.map(americanChip).join("")}</div>
        <div class="group-h" style="margin-top:24px;">Waffle <span class="sub">£10.00 · bubble or Belgian</span></div>
        <div class="flavor-grid cols-2" style="grid-template-columns:1fr 1fr;">${waffles.map(waffleChip).join("")}</div>
        <div class="group-h" style="margin-top:24px;">Crêpe <span class="sub">£10.00</span></div>
        <p style="font-size:16px; color:var(--ink-soft); margin:6px 0 0;">Choose any flavour from the waffle list — we'll fold it in.</p>
      </div>
    </div>
    <p class="note" style="margin-top:30px;">★ <span style="color:var(--ink);">Staff picks</span> — the ones we order most often.</p>`,
    foot(15),
  );
}

function renderKetoVeganGF(data: BookletData): string {
  const sec = findSection(data, "keto-vegan-gluten-free");
  const keto = findSub(sec, "keto")?.items ?? [];
  const vegan = findSub(sec, "vegan")?.items ?? [];
  const gf = findSub(sec, "gluten-free")?.items ?? [];
  return pageWrap(
    `
    ${headRow("V", "Keto, Vegan & Gluten-Free", "GF")}
    <div class="two-col">
      <div>
        <div class="group-h">Keto</div>
        <div class="menu-list">${keto.map((i) => itemRow(i, true)).join("")}</div>
        <div class="group-h">Vegan <span class="sub">+£0.70 for GF</span></div>
        <div class="menu-list">${vegan.map((i) => itemRow(i, true)).join("")}</div>
      </div>
      <div>
        <div class="group-h">Gluten-Free</div>
        <div class="menu-list">${gf.map((i) => itemRow(i, true)).join("")}</div>
      </div>
    </div>`,
    foot(16),
  );
}

function renderSushi(): string {
  return pageWrap(
    `
    <div class="content-area">
      ${eyebrowTitle("Pre-order only", "Sushi")}
      <div class="sushi-feature">
        <h2>Freshly made,<br/>crafted to order.</h2>
        <p class="lead">Premium ingredients, hand-rolled by our team.</p>
        <ul>
          <li>Choose from meat, fish, or vegan selections</li>
          <li>Available in 8, 16, 20, 30, or 50-piece platters</li>
          <li>Perfect for events, gatherings, or personal indulgence</li>
        </ul>
        <div class="cta">Pre-order now to enjoy handcrafted sushi at its finest.</div>
      </div>
      <div class="banner" style="margin-top:40px;">
        <div class="big">Events<br/>&amp; Catering</div>
        <div class="small">Ideal for parties, meetings and social gatherings. Tasty platters featuring mini sandwiches, sushi, snacks and finger foods. Menus fully customisable — just tell us what you need.</div>
      </div>
    </div>`,
    foot(17),
  );
}

function renderAllergens(data: BookletData): string {
  const cssCls = (code: string) => (code === "S02" ? "S" : code);
  const text = (code: string) => (code === "S02" ? "SO₂" : code);
  const isLight = (code: string) => ["Eg", "M", "Lu"].includes(code);
  const fontSize = (code: string) => (code === "S02" ? "20px" : "32px");
  return pageWrap(
    `
    ${eyebrowTitle("For your safety", "Allergen Information")}
    <p style="text-align:center; font-size:20px; max-width:820px; margin:0 auto 30px;">
      We take allergens seriously. Please read carefully — if you have any questions or specific dietary needs, ask a member of our team.
    </p>
    <h3 style="text-align:center; font-family:'Fraunces',serif; font-weight:600; font-size:32px; margin:14px 0 0;">Common allergens in our kitchen</h3>
    <p style="text-align:center; font-size:17px; color:var(--ink-soft); margin:6px 0 18px;">
      While we work to minimise cross-contamination, please note our kitchen handles:
    </p>
    <div class="allergen-grid">
      ${data.allergens
        .map((a) => `<div class="alg"><div class="dot${isLight(a.code) ? " lite" : ""}" style="background:var(--a${cssCls(a.code)}); font-size:${fontSize(a.code)};">${text(a.code)}</div><div class="lbl">${esc(a.name)}</div></div>`)
        .join("")}
    </div>
    <div class="two-col" style="margin-top:auto;">
      <div>
        <h3 style="font-family:'Fraunces',serif; font-weight:600; font-size:26px; color:var(--terra); margin:0 0 8px;">Cross-contamination</h3>
        <p style="font-size:17px; color:var(--ink-soft);">Although we follow strict hygiene and food-safety protocols, our kitchen is not allergen-free. Cross-contamination is possible and we cannot guarantee any dish is completely free from trace allergens.</p>
      </div>
      <div>
        <h3 style="font-family:'Fraunces',serif; font-weight:600; font-size:26px; color:var(--terra); margin:0 0 8px;">Custom orders &amp; dietary requests</h3>
        <p style="font-size:17px; color:var(--ink-soft);">We offer customisable options for many dishes. If you have specific dietary requirements, please tell us when ordering — we'll do our best to accommodate.</p>
      </div>
    </div>
    <p style="text-align:center; font-family:'Fraunces',serif; font-style:italic; font-size:24px; margin-top:30px; color:var(--ink);">
      Need more detail? Ask a staff member or contact us in advance.
    </p>`,
    foot(18),
  );
}

// ---- Main render ---------------------------------------------------------

export function renderBookletHtml(data: BookletData, baseUrl = ""): string {
  const base = baseUrl ? `<base href="${baseUrl}/">` : "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">${base}
<title>Sweet Life — Menu</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Sail&family=Inter:wght@300;400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{
  --paper:#f7f1e6; --ink:#1c140d; --ink-soft:#3b2c1f; --muted:#7a6a59; --rule:#1c140d;
  --terra:#b94a2c; --olive:#5d6b3a; --gold:#c98a2b; --berry:#7a2d3b;
  --paper-warm:#efe3cd; --paper-deep:#e7d6b8;
  --aG:#d98f2e; --aCr:#b62a2a; --aEg:#e7c233; --aF:#2c5fb3;
  --aCe:#5fa848; --aMu:#a06a2b; --aSe:#7a2a86; --aPe:#cc3a2a;
  --aSy:#2e7a3b; --aM:#7fb5ea; --aN:#6b4423; --aLu:#e8a338;
  --aMs:#7a4ea0; --aS:#a4a4a4;
}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
@page { size: 1240px 1754px; margin: 0; }
html,body{margin:0;padding:0;background:#1c140d;color:var(--ink);font-family:'Inter',sans-serif;}

.page{
  position:relative; width:1240px; height:1754px;
  background:var(--paper); padding:96px 110px 80px;
  font-family:'Inter',sans-serif; font-size:24px; color:var(--ink); line-height:1.35;
  overflow:hidden; page-break-after:always;
  background-image:
    radial-gradient(1200px 700px at 12% 10%, rgba(185,74,44,.04), transparent 60%),
    radial-gradient(900px 700px at 95% 95%, rgba(93,107,58,.05), transparent 60%);
}
.page:last-of-type{page-break-after:auto;}
.page.cream-deep{background-color:#efe3cd;}
.page.ink{background-color:#1c140d;color:#f7f1e6;}

.page::before, .page::after{
  content:""; position:absolute; width:42px; height:42px;
  border:1.5px solid var(--ink); opacity:.55;
}
.page::before{top:46px; left:46px; border-right:none; border-bottom:none;}
.page::after{top:46px; right:46px; border-left:none; border-bottom:none;}
.page .corners-bottom{position:absolute; inset:0; pointer-events:none;}
.page .corners-bottom::before, .page .corners-bottom::after{
  content:""; position:absolute; width:42px; height:42px;
  border:1.5px solid var(--ink); opacity:.55;
}
.page .corners-bottom::before{bottom:46px; left:46px; border-right:none; border-top:none;}
.page .corners-bottom::after{bottom:46px; right:46px; border-left:none; border-top:none;}

.pagefoot{
  position:absolute; bottom:46px; left:0; right:0;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 110px; font-size:14px; letter-spacing:.18em; text-transform:uppercase;
  color:var(--muted); white-space:nowrap;
}
.pagefoot .mark{font-family:'Sail',cursive; text-transform:none; letter-spacing:0; font-size:26px; color:var(--ink);}

.section-eyebrow{font-size:14px; letter-spacing:.32em; text-transform:uppercase; color:var(--terra); text-align:center; margin-bottom:18px;}
.section-title{font-family:'Fraunces',serif; font-weight:400; font-style:italic; font-size:104px; line-height:1; text-align:center; letter-spacing:-.01em; margin:0 0 6px; font-variation-settings:"opsz" 144;}
.section-rule{display:flex; align-items:center; justify-content:center; gap:14px; color:var(--ink); opacity:.75; margin:18px 0 44px;}
.section-rule .line{height:1px; background:var(--ink); width:120px; opacity:.6;}
.section-rule .diamond{width:6px; height:6px; background:var(--ink); transform:rotate(45deg);}

.menu-list{display:flex; flex-direction:column; gap:18px;}
.item{display:grid; grid-template-columns: 1fr auto; align-items:baseline; column-gap:14px; row-gap:4px;}
.item .name{font-family:'Fraunces',serif; font-weight:500; font-size:30px; letter-spacing:-.005em; display:flex; align-items:baseline; gap:10px; flex-wrap:wrap;}
.item .price{font-family:'Roboto Mono',monospace; font-weight:500; font-size:22px; color:var(--ink); white-space:nowrap; position:relative;}
.item .desc{grid-column:1 / -1; font-size:18px; color:var(--ink-soft); line-height:1.4; max-width:88%;}
.item .desc em.alt{font-style:italic; color:var(--terra);}
.item .name .tag{font-family:'Inter',sans-serif; font-size:14px; font-weight:600; letter-spacing:.06em; color:var(--terra); text-transform:uppercase; padding:2px 8px; border:1px solid var(--terra); border-radius:999px;}
.item .name .tag.olive{color:var(--olive); border-color:var(--olive);}
.item .name .tag.gold{color:var(--gold); border-color:var(--gold);}
.item .name .tag.berry{color:var(--berry); border-color:var(--berry);}

.item .row{grid-column:1 / -1; display:flex; align-items:baseline; gap:10px;}
.item .row .name{flex:0 1 auto;}
.item .row .dots{flex:1; border-bottom:1.5px dotted var(--ink); transform:translateY(-6px); opacity:.5;}
.item .row .price{flex:0 0 auto;}

.badges{display:inline-flex; gap:4px; margin-left:6px; transform:translateY(-2px);}
.b{display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:999px; color:#fff; font-size:11px; font-weight:700; font-family:'Inter',sans-serif; letter-spacing:.02em;}
.b.G{background:var(--aG);} .b.Cr{background:var(--aCr);} .b.Eg{background:var(--aEg); color:#1c140d;}
.b.F{background:var(--aF);} .b.Ce{background:var(--aCe);} .b.Mu{background:var(--aMu);}
.b.Se{background:var(--aSe);} .b.Pe{background:var(--aPe);} .b.Sy{background:var(--aSy);}
.b.M{background:var(--aM); color:#1c140d;} .b.N{background:var(--aN);} .b.Lu{background:var(--aLu); color:#1c140d;}
.b.Ms{background:var(--aMs);} .b.S{background:var(--aS); font-size:8px;}

.group-h{font-family:'Fraunces',serif; font-weight:600; font-size:28px; color:var(--terra); margin:18px 0 6px; letter-spacing:-.01em;}
.group-h .sub{color:var(--ink-soft); font-style:italic; font-weight:400; font-size:18px; margin-left:10px;}

.two-col{display:grid; grid-template-columns:1fr 1fr; gap:36px 60px;}

.note{font-size:16px; color:var(--terra); text-align:center; font-style:italic; margin-top:24px;}
.note.small{font-size:14px;}

.cover{display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; position:relative;}
.cover .est{font-size:14px; letter-spacing:.4em; text-transform:uppercase; color:var(--terra); margin-bottom:24px;}
.cover .wordmark{font-family:'Sail',cursive; font-size:240px; line-height:.85; color:var(--ink); margin:0;}
.cover .tag{font-family:'Fraunces',serif; font-style:italic; font-size:36px; color:var(--ink-soft); margin-top:8px;}
.cover .place{font-size:14px; letter-spacing:.3em; text-transform:uppercase; color:var(--muted); margin-top:36px;}
.cover .menu-word{font-family:'Fraunces',serif; font-weight:300; font-style:italic; font-size:64px; letter-spacing:.4em; text-transform:uppercase; margin-top:28px;}

.mark-inline{font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:var(--terra); letter-spacing:.04em;}

.build-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:20px 30px;}
.build-grid h4{font-family:'Fraunces',serif; font-weight:600; font-style:italic; font-size:22px; color:var(--terra); margin:0 0 6px; border-bottom:1.5px solid var(--terra); padding-bottom:6px;}
.build-grid ul{list-style:none; margin:0; padding:0; font-size:17px; color:var(--ink-soft); line-height:1.55;}
.build-grid ul li::before{content:"·  "; color:var(--terra); font-weight:700;}

.flavor-block{margin-bottom:34px;}
.flavor-h{display:flex; align-items:baseline; gap:14px; margin-bottom:8px;}
.flavor-h .lbl{font-family:'Fraunces',serif; font-style:italic; font-weight:500; font-size:30px; color:var(--terra);}
.flavor-h .price{font-family:'Roboto Mono',monospace; font-size:20px; color:var(--ink);}
.flavor-h .sub{font-size:14px; color:var(--muted); margin-left:8px;}
.flavor-grid{display:grid; grid-template-columns:repeat(5,1fr); gap:8px 14px;}
.flavor-grid .chip{border:1px solid var(--ink); border-radius:999px; padding:9px 14px; text-align:center; font-size:14px; letter-spacing:.08em; text-transform:uppercase; font-weight:500; background:var(--paper);}
.flavor-grid.cols-4{grid-template-columns:repeat(4,1fr);}
.flavor-grid.cols-3{grid-template-columns:repeat(3,1fr);}
.flavor-grid .chip .tea{display:block; font-size:10px; letter-spacing:.16em; color:var(--olive); margin-top:3px;}
.flavor-grid .chip .tea.assam{color:var(--terra);}
.flavor-grid .chip.dark{background:var(--ink); color:var(--paper); border-color:var(--ink);}

.allergen-grid{display:grid; grid-template-columns:repeat(7,1fr); gap:30px 16px; margin:30px 0 40px;}
.alg{display:flex; flex-direction:column; align-items:center; gap:8px;}
.alg .dot{width:78px; height:78px; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:'Fraunces',serif; font-weight:600; font-size:32px;}
.alg .dot.lite{color:#1c140d;}
.alg .lbl{font-size:12px; letter-spacing:.18em; text-transform:uppercase; text-align:center; color:var(--ink);}

.banner{margin-top:auto; padding:24px 32px; background:var(--ink); color:var(--paper); border-radius:8px; display:flex; align-items:center; justify-content:space-between; gap:30px;}
.banner .big{font-family:'Fraunces',serif; font-style:italic; font-weight:300; font-size:54px; line-height:1; white-space:nowrap; flex-shrink:0;}
.banner .small{font-size:15px; max-width:520px; line-height:1.45; color:#e2d2b1;}

.feature-row{display:grid; grid-template-columns:repeat(3,1fr); gap:30px; margin-top:30px;}
.feature-card{background:var(--paper); border:1.5px solid var(--ink); border-radius:6px; padding:24px; display:flex; flex-direction:column; gap:10px; aspect-ratio:1/1.1; position:relative;}
.feature-card .ph{flex:1; border:1.5px dashed var(--muted); border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--muted); font-family:'Roboto Mono',monospace; font-size:11px; letter-spacing:.18em; text-transform:uppercase; background:repeating-linear-gradient(135deg, transparent 0 8px, rgba(28,20,13,.04) 8px 9px);}
.feature-card .nm{font-family:'Fraunces',serif; font-weight:600; font-size:22px; line-height:1.15;}
.feature-card .pr{font-family:'Roboto Mono',monospace; font-size:18px; color:var(--terra); font-weight:600;}

.events-list{font-size:22px; line-height:1.55; max-width:660px;}
.events-list li{margin-bottom:18px;}

.toc{display:grid; grid-template-columns:1fr 1fr; gap:14px 60px; font-family:'Fraunces',serif; font-size:26px; margin-top:30px;}
.toc .toc-item{display:flex; align-items:baseline; gap:14px; padding:6px 0; border-bottom:1px dotted rgba(28,20,13,.4);}
.toc .num{font-family:'Roboto Mono',monospace; font-size:14px; color:var(--terra); width:28px;}
.toc .ttl{flex:1; font-style:italic;}
.toc .pg{font-family:'Roboto Mono',monospace; font-size:14px; color:var(--muted);}

.qr{width:240px; height:240px; border:2px solid var(--ink); border-radius:8px; display:grid; grid-template-columns:repeat(8,1fr); grid-template-rows:repeat(8,1fr); padding:14px; gap:3px; background:var(--paper);}
.qr div{background:var(--ink);}
.qr div.off{background:transparent;}

.socials{display:flex; gap:30px; justify-content:center; margin-top:30px;}
.social{display:flex; flex-direction:column; align-items:center; gap:8px; font-size:14px; letter-spacing:.1em;}
.social .ic{width:48px; height:48px; border-radius:999px; background:var(--ink); color:var(--paper); display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-weight:700; font-size:24px;}

.full-bleed-bottom{margin:24px -110px 0; padding:24px 110px 28px; background:var(--ink); color:var(--paper);}
.full-bleed-bottom h3{font-family:'Fraunces',serif; font-weight:300; font-style:italic; font-size:36px; margin:0 0 10px; text-align:center;}
.full-bleed-bottom .build-grid ul{font-size:14px; line-height:1.45; color:#e2d2b1;}
.full-bleed-bottom .build-grid h4{font-size:18px; color:#e6a98a; border-color:#e6a98a;}
.full-bleed-bottom .build-grid ul li::before{color:#e6a98a;}

.price-strip{display:flex; align-items:center; gap:14px; font-family:'Roboto Mono',monospace; font-size:18px; margin-top:6px; color:var(--ink-soft);}
.price-strip strong{color:var(--terra);}

.content-area{display:flex; flex-direction:column; height:calc(100% - 60px);}

.head-row{display:flex; align-items:center; gap:24px; margin-bottom:18px;}
.head-row .glyph{width:64px; height:64px; border:1.5px solid var(--ink); border-radius:999px; display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-style:italic; font-weight:600; font-size:28px; color:var(--terra);}
.head-row .section-title{font-size:84px; text-align:left; flex:1;}

.item.compact .name{font-size:24px;}
.item.compact .desc{font-size:14px; max-width:92%; line-height:1.35;}

.sushi-feature{background:var(--paper-deep); border:1.5px solid var(--ink); border-radius:6px; padding:60px; text-align:center;}
.sushi-feature h2{font-family:'Fraunces',serif; font-style:italic; font-weight:400; font-size:90px; line-height:1; margin:0 0 18px;}
.sushi-feature .lead{font-size:24px; color:var(--ink-soft); margin-bottom:30px;}
.sushi-feature ul{list-style:none; padding:0; max-width:540px; margin:0 auto; font-size:20px; line-height:1.7;}
.sushi-feature ul li::before{content:"◆  "; color:var(--terra);}
.sushi-feature .cta{margin-top:30px; font-family:'Fraunces',serif; font-style:italic; font-size:28px; color:var(--terra);}

.photo-strip{margin-top:auto; display:grid; grid-template-columns:repeat(3,1fr); gap:14px; padding-top:18px;}
.photo-strip .ph{aspect-ratio:4/3; border:1.5px dashed var(--muted); border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--muted); font-family:'Roboto Mono',monospace; font-size:10px; letter-spacing:.18em; text-transform:uppercase; background:repeating-linear-gradient(135deg, transparent 0 8px, rgba(28,20,13,.05) 8px 9px);}

.acai-card{margin-top:18px; background:var(--ink); color:var(--paper); padding:20px 28px; border-radius:6px; display:grid; grid-template-columns: auto 1fr 1fr 1fr; gap:18px 24px; align-items:start;}
.acai-card .price-tag{width:68px; height:68px; border-radius:999px; background:var(--terra); display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-weight:700; font-style:italic; font-size:26px; grid-row:1 / 3;}
.acai-card h3{font-family:'Fraunces',serif; font-style:italic; font-weight:400; font-size:32px; margin:0; line-height:1; grid-column:2 / -1;}
.acai-card .lead{grid-column:2 / -1; margin-top:-6px; color:#e2d2b1; font-size:14px; letter-spacing:.04em;}
.acai-card h4{font-family:'Fraunces',serif; font-weight:500; font-size:15px; color:#e6a98a; margin:6px 0 4px; letter-spacing:.04em; text-transform:uppercase;}
.acai-card ul{list-style:none; padding:0; margin:0; font-size:14px; line-height:1.5; color:#e2d2b1;}

.right{text-align:right;}
.center{text-align:center;}

.cover-page::before, .cover-page::after { display:none; }
.cover-page .corners-bottom::before, .cover-page .corners-bottom::after { display:none; }
</style></head>
<body>
${renderCover()}
${renderContents()}
${renderNewOnMenu(data)}
${renderBreakfast(data)}
${renderCoffeeTea(data)}
${renderGourmetLattes(data)}
${renderSignatureDrinks(data)}
${renderShakes(data)}
${renderBakery(data)}
${renderLunch(data)}
${renderSalads(data)}
${renderCreateYourOwn(data)}
${renderCakes(data)}
${renderSoftServe(data)}
${renderBingsuMore(data)}
${renderKetoVeganGF(data)}
${renderSushi()}
${renderAllergens(data)}

<script>
(function(){
  var qr = document.getElementById('qr'); if (!qr) return;
  var N = 8, cells = [], s = 7;
  function rnd(){ s = (s*9301 + 49297) % 233280; return s/233280; }
  for (var i=0;i<N*N;i++) cells.push(rnd() > .5 ? 1 : 0);
  function setF(r,c){ for (var dr=0;dr<3;dr++) for (var dc=0;dc<3;dc++){ var on=(dr===0||dr===2||dc===0||dc===2||(dr===1&&dc===1)); cells[(r+dr)*N+(c+dc)]=on?1:0; } }
  setF(0,0); setF(0,N-3); setF(N-3,0);
  for (var j=0;j<N*N;j++){ var d=document.createElement('div'); if (!cells[j]) d.className='off'; qr.appendChild(d); }
})();
</script>
</body></html>`;
}
