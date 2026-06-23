# Sweet Life – Revolut POS vs Menu.json Reconciliation Report
Generated: 2026-05-24

---

## Summary Statistics

| Metric | Count |
|---|---|
| Unique Revolut products (deduped, all categories) | 318 |
| Real products (excl. junk categories) | 260 |
| Exact name matches | 111 |
| Confirmed near-matches (same item, different spelling) | 12 |
| **Total cleanly matched** | **123** |
| Price mismatches (matched items, price differs) | 12 |
| In Revolut but NOT in our menu | 76 |
| In our menu but NOT in Revolut | 104 |
| Human-review near-matches (uncertain) | 7 |
| Junk-category items in Revolut (Uncategorised/Bars/Beverages/Extra) | 58 |

---

## Category Mapping

| Raw Revolut Category | Canonical Category | Our Menu Section |
|---|---|---|
| Coffee & Tea / coffee & tea | Coffee & Tea | Coffee & Tea |
| Bakery & Pastries / bakery & pastry | Bakery & Pastries | Bakery & Pastries |
| Breakfast & Brunch / breakfast | Breakfast & Brunch | Breakfast & Brunch |
| Lunch / lunch | Lunch | Lunch |
| Create Your Own / create your own | Lunch | Lunch (Create Your Own subsection) |
| Salads | Salads | Salads |
| Keto, Vegan & Gluten Free / keto, vegan, gluten free | Keto, Vegan & Gluten-Free | Keto, Vegan & Gluten-Free |
| Cakes, Cookies & Bites / cakes, cookies & bites | Cakes, Cookies & Bites | Cakes, Cookies & Bites |
| hot desserets / Hot Desserts | Hot Desserts | **No direct match** — maps to Pancakes & Waffles + Golden Toast |
| soft serve / bingsu / Soft Serve Ice-Cream / Bingsu | Bingsu / Soft Serve | Bingsu + Soft-Serve Ice-cream subsections |
| Shakes, Smoothies & Frappes / shakes smoothies & frappes | Signature Drinks | Signature Drinks |
| Signature Drinks / signature drinks | Signature Drinks | Signature Drinks |
| Gourmet Lattes / gourmet lattes | Gourmet Lattes | Gourmet Lattes |
| sushi / Sushi (Pre-Order Only) | Sushi (Pre-order Only) | Sushi (Pre-order Only) |
| **Uncategorised** | JUNK | Not mapped — see Junk Items section |
| **Bars** | JUNK | Not mapped (confectionery bars sold as snacks) |
| **Beverages** | JUNK | Not mapped (soft drinks, water, juices) |
| **Extra** | JUNK | Not mapped (generic charge lines: bag, vegan surcharge, etc.) |

**Note on "Hot Desserts":** Revolut uses a single "Hot Desserts" category for waffles, pancakes, and golden toast, where our menu separates these into `Pancakes & Waffles` and `Golden Toast` sections. Revolut has generic entries like 'Belgian Waffle', 'Bubble Waffle', 'Soufflé Pancake' whereas our menu has individual named flavours.

---

## 1. In Revolut but NOT in Our Menu

These 76 items are sold at the POS but missing from menu.json. They are candidates to add, but many need investigation (typos, duplicates, renamed items).

### Bakery & Pastries (4 items)
| Revolut Name | Price | Notes |
|---|---|---|
| Beef & mince pie | £5.00 | New item — not on menu |
| Danish pastries | £3.60 | Near-match with 'Danish Pastry' (£3.60) — likely same item, name variant |
| Lemon Croissant | £3.60 | New item — not on menu |
| Pistachio donut | £3.00 | New item — not on menu |

### Bingsu / Soft Serve (6 items)
| Revolut Name | Price | Notes |
|---|---|---|
| Baby | £3.50 | Likely 'Baby Soft Serve' (menu has £3.00) — name truncated; **price mismatch** |
| Soft serve sit in | £4.50 | Appears to be a dine-in pricing variant (vs takeaway). Not in menu |
| bingsu small | £7.00 | Generic size SKU. Menu shows individual flavours at £6.50 small. **Price mismatch** |
| bingsu medium | £8.50 | Generic size SKU. Menu shows medium at £7.50. **Price mismatch** |
| bingsu large | £10.00 | Generic size SKU. Menu shows large at £8.50. **Price mismatch** |
| toppings - almonds / pistachio powder / sprinkles/flake | £0.40–£0.50 | Modifier line items — match global_modifiers in menu |

### Breakfast & Brunch (12 items)
| Revolut Name | Price | Notes |
|---|---|---|
| 1x slice toast with 1x egg | £6.00 | Abbreviated version of 'Egg Toast' (menu £6.50) — likely same item |
| 1x sliced toast with Scramble eggs | £6.50 | Variant of Egg Toast or new item |
| Acai coconut 🥥 | £8.50 | Coconut base variant of Acai Granola Bowl (menu £8.00) |
| acai granola | £8.00 | Matches 'Acai Granola Bowl' — likely duplicate Revolut entry at same price |
| Breakfast Mffin | £9.00 | Typo of 'Breakfast Muffin' (menu £9.00) — same item, typo in POS |
| Breakfast Omelette Taco | £9.00 | New breakfast taco variant not in menu |
| french toast w/bacon & maple syrup | £9.00 | Duplicate Revolut entry of same item (two spellings) |
| French Toast w/bacon and maple syrup | £9.00 | Duplicate of above — consolidate in POS |
| Ham & cheese Taco | £9.00 | New item — mentioned as variant in Breakfast Taco description but not standalone |
| omelette tortilla / Omelette Tortilla Bake | £11.00 | Two Revolut entries for 'Tortilla Omelette' (menu £11.00) — same item |
| Outs pot | £6.00 | Likely 'Oat pot' or 'Porridge' variant (menu Porridge £6.00) |
| salmon sunrise 1/2 | £8.50 | Matches 'Salmon Sunrise' Half Portion variant (menu £8.50) — correct |
| salmon sunrise full | £12.00 | Matches 'Salmon Sunrise' full (menu £12.00) — same item, split entries |
| scrambled egg ciabata | £9.00 | Typo of 'Scrambled Egg Ciabatta' (menu £9.00) — same item |
| Side of bacon | £1.50 | Add-on item not on menu |
| Smoothie Bowl | £8.00 | New item — not on menu |
| x2 toast x2 egg | £7.00 | Custom breakfast combination not on menu |

### Cakes, Cookies & Bites (9 items)
| Revolut Name | Price | Notes |
|---|---|---|
| Banana Bread | £5.00 | New item |
| Biscoff Rocky Road | £4.00 | Revolut has both 'Rocky Road' (matched) and 'Biscoff Rocky Road' — variant |
| cake | £5.00 | Generic fallback SKU — unclear which cake |
| Coconut protein ball | £3.00 | Variant of 'Protein Balls' (menu £3.00) — coconut flavour |
| Cookie Cake | £5.00 | New item |
| dubai chocolate large | £6.00 | Matches 'Dubai Chocolate' Large variant (menu £6.00) — same item |
| Macaroons (GF) | £3.00 | Different price to 'Macaroon (GF)' (menu £2.60) — **price mismatch +£0.40** |
| Oreo cake | £5.00 | New item |
| rocky road / belgium square | £4.00 | Combined generic SKU — both exist separately in menu |
| Vegan Jaffa cake | £5.50 | New item |

### Coffee & Tea (6 items)
| Revolut Name | Price | Notes |
|---|---|---|
| Coffee Beans | £18.00 | Retail item — not on menu |
| Creamy Matcha | £5.00 | New matcha drink not on menu (menu has Matcha Latte £4.00, Matcha Tea £3.80) |
| jasmine brew | £3.80 | Abbreviation of 'Jasmine Brew Tea' (menu £3.80) — same item |
| mochaccino | £3.80 | Alternate spelling of 'Mocaccino' (menu £3.70) — same item, **price mismatch +£0.10** |
| strawberry babycino | £3.00 | Matches 'Strawberry Babyccino' variant (menu £3.00) — same item |
| tea pot | £4.50 | Matches 'Tea Pot' variant (menu £4.50) — same item |

### Gourmet Lattes (5 items — grouped Revolut SKUs)
| Revolut Name | Price | Notes |
|---|---|---|
| banana / creme brulee / blue lagoon / ice cream espresso | £4.50 | Grouped SKU covering 4 individual items in menu |
| coconut kiss / tiramisu / beetroot / strawberry | £4.50 | Grouped SKU covering 4 individual items in menu |
| coconut lychee / creamy coconut / pistachio / panda | £5.50 | Grouped SKU covering 4 individual items in menu |
| Creme Brûlée Latte | £4.50 | Individual entry — same as 'Creme Brulee Latte' (menu £4.50) — spelling variant |
| lotus / peanut / kinder / cream panner | £5.00 | Grouped SKU covering 4 individual items in menu |

**Note:** Revolut uses grouped SKUs for entire tiers of Gourmet Lattes. Our menu has each latte individually. Both approaches are valid at the POS; the menu should reflect the individual names.

### Hot Desserts (5 items)
| Revolut Name | Price | Notes |
|---|---|---|
| American Pancakes | £10.00 | Generic entry — menu has 'Original American Pancake' and 'Matcha American Pancake' |
| Belgian Waffle | £10.00 | Generic entry — menu has named waffles (Strawberry, Oreo, etc.) |
| Bubble Waffle | £10.00 | New item or generic variant — menu has 'Banana-Lotus Waffle' etc., no plain Bubble Waffle |
| Soufflé Pancake | £12.00 | Generic entry — menu has 'Choco Banana' and 'S'more' variants |
| waffle / bubble waffle | £10.00 | Combined generic SKU |

### Keto, Vegan & Gluten-Free (4 items)
| Revolut Name | Price | Notes |
|---|---|---|
| almond Belgian waffle | £14.00 | Matches 'Almond Belgium Waffle (K)' (menu £14.00) — same item, spelling variant |
| Creamy Almond Coffee Dream (K) | £6.00 | New keto item not on menu |
| macaroons | £3.00 | Possibly 'Macaroon (GF)' (menu £2.60) — **price mismatch** — or different non-GF macaroon |
| vegan sausage Bap | £9.00 | Matches 'Vegan Sausages Bap' — same item, spelling variant |

### Lunch (13 items)
| Revolut Name | Price | Notes |
|---|---|---|
| Beetroot Belgium Waffle | £12.00 | New lunch item — not in menu |
| Beetroot-Feta Burger | £9.00 | Matches 'Beetroot Feta Burger' (menu £9.00) — hyphen variant, same item |
| black jack burger | £10.00 | Abbreviation of 'Black Jack Pulled Pork Burger' (menu £10.00) — same item |
| Chicken Goujons x3 | £5.00 | Separate smaller portion; menu has 'Goujons & Chips' £8.00 (with chips) |
| Ciabatta | £9.00 | New base option — not in menu's Create Your Own list |
| Fishcake Burger | £10.00 | Matches 'Fishcake Burger' (menu £10.00) — same item (extra space in POS name) |
| fried rice | £10.00 | New item not on menu |
| Goujons & Fries | £8.00 | Matches 'Goujons & Chips' (menu £8.00) — Fries vs Chips naming |
| Meatball Pasta | £7.00 | Ambiguous: could be half portion of 'Meatball Tagliatelle Pasta' (half £7.00) |
| meatball pasta full | £11.00 | Matches 'Meatball Tagliatelle Pasta' full (menu £11.00) — same item |
| meatball pasta half | £6.00 | Matches 'Meatball Tagliatelle Pasta' Half Portion (menu £7.00) — **price mismatch -£1.00** |
| Quesadillas | £10.00 | Matches 'Quesadilla' (menu £10.00) — plural vs singular, same item |
| ramen | £10.00 | Matches 'Ramen Soup (*V)' (menu £10.00) — abbreviated name, same item |
| soup | £6.00 | Matches 'Homemade Soup of the Day' (menu £6.00) — same item |
| Take away sandwich | £7.00 | Takeaway pricing SKU — matches 'Sandwich' (menu £7.00) |
| vegan meat | £2.00 | Add-on/substitution charge — not a standalone menu item |

### Signature Drinks (6 items)
| Revolut Name | Price | Notes |
|---|---|---|
| Frappé | £6.00 | Generic frappe SKU. Menu has 7 individual frappes. |
| Fruit Tea | £4.00 | Generic fruit tea SKU at £4.00. Menu has 7 individual fruit teas at £4.50. **Price mismatch** |
| green oasis / cherry sip / mojito | £4.50 | Grouped SKU covering 3 individual 'Refreshing Drinks' items in menu |
| Passion Fruit Mojito (Virgin) | £4.50 | Similar to 'Passionfruit Mojito' (menu £4.50) — likely same item, slight name diff |
| smoothie toppings | £0.50 | Modifier charge — matches global_modifiers |
| hot milk tea | £0.20 | Modifier charge (Hot +£0.20) — matches global_modifiers |

### Sushi (5 items — actual sushi platter pricing)
| Revolut Name | Price | Notes |
|---|---|---|
| 8pc | £12.00 | 8-piece platter price — menu has 'Sushi Platter' with no price listed |
| 16 pcs | £24.00 | 16-piece platter |
| 20 pcs | £30.00 | 20-piece platter |
| 30 pcs | £40.00 | 30-piece platter |
| 50 pcs | £70.00 | 50-piece platter |

**Action:** These are the actual sushi prices. Update menu.json Sushi Platter variants with these prices.

---

## 2. In Our Menu but NOT in Revolut

These 104 items appear in menu.json but have no matching Revolut POS entry. Many are explained below.

### Bakery & Pastries (8 items) — Missing POS entries
- Plain Scone £3.60, Raspberry & White Chocolate Scone £3.80, Gluten Free Scone £4.20
- Plain Croissant £2.60, Butter & Jam Croissant £3.00, Nutella Croissant £3.00
- Muffins £3.60, Danish Pastry £3.60
  
**Note:** Revolut has 'Fruit Scone' (matched) and 'Pistachio Croissant' (matched) but the above are NOT in Revolut. Either these items are no longer sold, or they were rung up using generic 'Croissant' or 'Scone' POS entries.

### Breakfast & Brunch (2 items)
- French Toast x2 with Bacon & Maple Syrup £9.00 — Revolut has 'French Toast x2' at £7.00 (**price mismatch**) and also separate entries 'french toast w/bacon & maple syrup'
- Breakfast Taco £9.00 — Revolut has 'Vegetarian Breakfast Taco' £9.00 (near-match, human review)

### Bingsu (11 items) — All individual bingsu flavours
All 11 named bingsu flavours are in our menu but not individually in Revolut. Revolut has 3 generic size SKUs: 'bingsu small' £7.00, 'bingsu medium' £8.50, 'bingsu large' £10.00 (vs menu's £6.50/£7.50/£8.50 — **price mismatch on all three sizes**).

### Golden Toast (5 items) — All golden toast flavours
Choco Banana, Mixed Berry, Apple Pie, S'more, Mango — all at £15.00. Revolut has a generic 'Golden Toast' £15.00 entry. Menu flavours should either stay or be consolidated to match POS entry.

### Pancakes & Waffles (10 items)
All individual pancake and waffle flavours are missing from Revolut. Revolut uses generic entries:
- 'American Pancakes' £10.00, 'Belgian Waffle' £10.00, 'Bubble Waffle' £10.00, 'Soufflé Pancake' £12.00

Individual menu items that have no Revolut equivalent: Choco Banana Souffle Pancake, S'more Souffle Pancake, Original American Pancake, Matcha American Pancake, Strawberry Waffle, Oreo Waffle, Strawberry Choco Waffle, Banana-Lotus Waffle, Plain Waffle (with Nutella ice cream), Lemon Maple Syrup Icing Waffle.

### Signature Drinks (52 items) — Biggest gap
All individual drinks in these subsections are in menu.json but NOT individually in Revolut:
- 10 Milk Teas, 7 Fruit Teas, 4 Refreshing Drinks, 11 Smoothies, 7 Frappes, 8 Milkshakes, 5 Protein Shakes
  
**Revolut approach:** Single generic SKUs per drink type ('Milk Tea', 'Frappe', 'Smoothie', etc.) instead of individual flavours. The menu is more granular. This is a structural difference — Revolut won't ring up individual flavours separately.

### Gourmet Lattes (3 items)
- Creme Brulee Latte £4.50 — Revolut has 'Creme Brûlée Latte' (accent variant) and also grouped in 'banana / creme brulee / blue lagoon / ice cream espresso' SKU
- White Hot Chocolate £4.50 — Not in Revolut. Revolut has 'Hot Chocolate' (matched) only.
- Strawberry Hot Chocolate £4.50 — Not in Revolut.

### Keto, Vegan & Gluten-Free (3 items)
- Vegan Sausages Bap (V)(GF*) £9.00 — Revolut has 'Vegan Sausages (GF) (V)' (matched) and 'vegan sausage Bap' — likely the same item appearing 3 times in Revolut
- Toastie/Sandwich (GF) £8.50 — Revolut has 'sandwich / toastie (GF)' (matched via near-match)
- Snickers Cake / Toblerone (GF) £4.60 — Revolut has variants at £5.00 (**price mismatch +£0.40**)

### Cakes, Cookies & Bites (6 items)
- Apple Pie £5.00 — Not in Revolut (Revolut has 'Strawberry Apple Pie' — human review)
- Cheesecake £5.00 — Not in Revolut
- Small Scoop (ice cream add-on) £0.60 — Not in Revolut (Revolut has 'add ice-cream small' £0.60 as separate SKU)
- Homemade Ice-cream £4.50 — Not in Revolut
- Baby Soft Serve £3.00 — Revolut has 'Baby' £3.50 (near-match; **price mismatch +£0.50**)
- Large Soft Serve £4.50 — Not in Revolut

### Lunch (6 items)
- Chicken Wings £12.00 — Not in Revolut
- The Mohawk Burger & Fries £15.00 — Revolut Uncategorised has 'Mohawk Burger' £15.00
- Meatball Tagliatelle Pasta £11.00 — Revolut has 'meatball pasta full' £11.00 (same item)
- Sourdough Bagel £9.00 — Not in Revolut (but 'Bagel (GF)' is matched separately)
- Baguette £9.00 — Not in Revolut (separate from 'Prosciutto Ham & Feta Cheese Baguette')

### Sushi (1 item)
- Sushi Platter — price null in menu. Revolut has actual prices (see above).

---

## 3. Price Mismatches

Items that match but have different prices between Revolut (base price from Default=Y row) and menu.json.

| Item | Revolut Price | Menu Price | Delta | Priority |
|---|---|---|---|---|
| Bagel (GF) | £9.00 | £10.00 | -£1.00 | HIGH — £1 discount at POS |
| Fruit Scone | £4.50 | £3.60 | +£0.90 | HIGH — POS charges 90p more |
| Lemon Meringue | £5.50 | £5.00 | +£0.50 | MEDIUM |
| Raspberry, Ginger & Lemon Tea | £4.50 | £4.00 | +£0.50 | MEDIUM |
| Chocolate Fudge Cake (GF) | £5.50 | £5.30 | +£0.20 | LOW |
| Macaroon (GF) | £3.00 | £2.60 | +£0.40 | LOW |
| Crumble Cookie | £4.30 | £4.00 | +£0.30 | LOW |
| Matcha Tea | £4.00 | £3.80 | +£0.20 | LOW |
| Mocaccino | £3.80 | £3.70 | +£0.10 | LOW |
| Americano | £3.40 | £3.50 | -£0.10 | LOW — POS charges 10p less |

**Additional price mismatches from near-matched items:**

| Revolut Name | Menu Name | Revolut Price | Menu Price | Delta |
|---|---|---|---|---|
| French Toast x2 | French Toast x2 with Bacon & Maple Syrup | £7.00 | £9.00 | -£2.00 |
| Snickers / Toblerone Cake (GF) variants | Snickers Cake / Toblerone (GF) | £5.00 | £4.60 | +£0.40 |
| bingsu small (generic) | All Bingsu (small size) | £7.00 | £6.50 | +£0.50 |
| bingsu medium (generic) | All Bingsu (medium size) | £8.50 | £7.50 | +£1.00 |
| bingsu large (generic) | All Bingsu (large size) | £10.00 | £8.50 | +£1.50 |
| Baby (soft serve) | Baby Soft Serve | £3.50 | £3.00 | +£0.50 |
| meatball pasta half | Meatball Tagliatelle Pasta (Half) | £6.00 | £7.00 | -£1.00 |

---

## 4. Human-Review Near-Matches

These 7 pairs may or may not be the same item. A human should confirm before updating either system.

| Revolut Name | Menu Name | Revolut Price | Menu Price | Concern |
|---|---|---|---|---|
| French Toast x2 | French Toast x2 with Bacon & Maple Syrup | £7.00 | £9.00 | Same item? £2 price gap is significant |
| Vegetarian Breakfast Taco | Breakfast Taco | £9.00 | £9.00 | Vegetarian variant vs full taco? Or same item different name? |
| snickers cake | Snickers Cake / Toblerone (GF) | £6.00 | £4.60 | Snickers cake £6 = non-GF version? Different item? |
| Strawberry Apple Pie | Apple Pie | £5.00 | £5.00 | Seasonal variant or same base item? |
| goujons | Goujons & Chips | £6.00 | £8.00 | Goujons only (no chips) at lower price? Or same item wrong price? |
| Sushi | Sushi Platter | £12.00 | null | Generic 'Sushi' entry at £12 = 8pc platter? |
| Bingsu (generic) | Taro Bingsu (and others) | £7.00 | £6.50 | Generic Bingsu SKU vs individual flavours — structural difference |

---

## 5. Confirmed Near-Matches (Resolved)

These were matched by near-name matching and confirmed as the same item. No action needed unless prices differ.

| Revolut Name | Menu Name | Match Type | Price Same? |
|---|---|---|---|
| croissant ham & cheese | Ham & Cheese Croissant | word overlap 100% | Yes (£4.50) |
| croissant pistachio | Pistachio Croissant | word overlap 100% | Yes (£4.50) |
| Regular | Regular Soft Serve | substring | Yes (£3.80) |
| bagel poached egg & bacon / Bagel W/ Poached Egg & Bacon | Poached Egg & Bacon Bagel | word overlap | Yes (£9.00) |
| Belgium Caramel squares | Belgium Caramel Square | substring | Yes (£3.60) |
| Black Forest Gateaux | Black Forest Gateau | substring (spelling) | Yes (£5.00) |
| Mocha | Mocha / White Mocha | alias | Yes (£4.50) |
| sandwich / toastie (GF) | Toastie/Sandwich (GF) | word overlap | Yes (£8.50) |
| Snickers / Toblerone Cake (GF) / snickers cake (GF) | Snickers Cake / Toblerone (GF) | word overlap | POS £5.00 vs Menu £4.60 (+£0.40) |
| Vegan Sausages (GF) (V) | Vegan Sausages Bap (V)(GF*) | substring | Yes (£9.00) |
| Black Jack Pulled Pork Burger Bun | Black Jack Pulled Pork Burger | substring | Yes (£10.00) |
| Pasta | Pasta Tagliatelle | substring | Yes (£11.00) |
| Pizza Bagel | Sourdough Pizza Bagel | substring | Yes (£9.00) |
| Burrata/Mozzarella & Mango Salad | Mozzarella & Mango Salad | substring | Yes (£10.00) |

---

## 6. Junk Category Items (Not in Menu)

These 58 items live in Revolut's junk categories and are not expected to appear in our structured menu. Listed for completeness.

### Beverages (soft drinks, water, juice) — £2.00–£3.00
Apple/Orange Juice, Capri Sun Small, Coke, Fanta, Fruit Shoots, Irish Power Water, Jug of Dilute, Kombucha, Matcha Ice Tea, Merry Meerkat, Red Bull, Sparkling Water, Sprite, Still Water, Vit-Hit

### Bars (confectionery) — £2.00
Crisps, Kinder Bueno (bar), Twix

### Extra (charge lines) — £0.25–£2.00
Bag, Extra 0.50, Extra 0.60, Extra 1.00, Extra 2.00, Vegan Sausage Ex(tra)

### Uncategorised (seasonal/misc items) — various prices
Notable items that may warrant menu entries:
- **Burning Love Burger** £14.00 — appears to be a featured/seasonal burger
- **Christmas toastie** £12.00 — seasonal
- **Festive Fries** £15.00 — seasonal
- **Mohawk Burger** £15.00 — duplicate of 'The Mohawk Burger & Fries' (menu £15.00) in Uncategorised
- **Pink Matcha Latte** £5.00 — unlisted drink item
- **Salmon Bruschetta for Two** £14.00 — sharing item not on menu
- **Strawberry Mocha** £4.50 — drink variant (our menu has Mocha/White Mocha only)
- **Tiramisu glass cake** £5.50 — may be different from 'Tiramisu' (£5.50 vs menu £5.50, same price)
- **Love Toast** £8.00 — unclear item
- **Gluten Free Blueberry Muffin** £4.50 — specific GF muffin flavour
- **Vegan choco orange pudding** £5.00 — vegan dessert not on menu
- **Portuguese Custard Tart** £2.20 — small pastry item

---

## 7. Sanity Flags

### Multiple Default=Y Rows (76 products)
76 products have more than one row with Default='Y' in the CSV. This is a Revolut data quality issue — the system assigned multiple "default" rows to a single product (likely when the same product exists in multiple categories or was duplicated during a POS migration). For all 76, the first Default=Y row was used as the base price — this should match what staff actually see at the POS.

### High Row Count Products (5 products)
Products with unusually high variation permutation counts, indicating complex modifier setups:

| Product | Row Count | Explanation |
|---|---|---|
| Cappuccino | 85 | Size × milk type × syrup combinations |
| Latte | ~80 | Same |
| Flat White | ~75 | Same |
| Hot Chocolate | ~60 | Size × topping combinations |
| Mocha / White Mocha | ~55 | Same |

These are expected for drinks with extensive customisation options. No action needed.

### Zero/Blank Price Items
None found among Default=Y rows. All products have a base price.

---

## Top 10 Priority Actions

1. **Bingsu pricing** — Revolut charges £7/£8.50/£10 (S/M/L) vs menu's £6.50/£7.50/£8.50. Decide which is correct and update the other. Gap of up to £1.50.

2. **Bagel (GF)** — Revolut £9.00 vs menu £10.00. £1 discrepancy — confirm correct price.

3. **Fruit Scone** — Revolut £4.50 vs menu £3.60. POS is charging 90p more.

4. **Sushi platter prices** — Menu has no prices listed. Revolut has: 8pc £12, 16pc £24, 20pc £30, 30pc £40, 50pc £70. Add these to menu.json.

5. **Signature Drinks structural mismatch** — Revolut uses generic SKUs (one entry per drink type); menu has 52 individual named drinks. Decide: does the POS need individual SKUs per flavour, or should the menu be restructured to show generic categories with flavour selection?

6. **Revolut POS cleanup** — 'Breakfast Mffin' (typo), two near-identical French Toast entries, two Salmon Sunrise entries, two Omelette Tortilla entries. Fix POS names to match menu.

7. **French Toast x2** — Revolut shows £7.00, menu says £9.00 (£2 gap). Confirm which is the correct in-store price.

8. **Lemon Meringue + Raspberry Ginger Lemon Tea** — Both 50p more expensive on Revolut than on the menu. Update menu or POS.

9. **New items to consider adding to menu** — Beef & mince pie £5, Lemon Croissant £3.60, Pistachio donut £3.00, Side of bacon £1.50, Banana Bread £5, Cookie Cake £5, Creamy Almond Coffee Dream (K) £6, Smoothie Bowl £8, Fried Rice £10, Ciabatta £9, Beetroot Belgium Waffle £12, Creamy Matcha £5.

10. **Pancakes & Waffles / Golden Toast naming** — Menu has specific flavour names; Revolut has generic entries. Either add individual POS SKUs for each flavour, or update the menu to use the generic Revolut names and list flavours as text descriptions.
