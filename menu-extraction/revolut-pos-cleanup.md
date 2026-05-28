# Revolut POS — to-do list for mum

Updated 2026-05-24. The website/database is now finalised. These are the few things to tidy up **inside Revolut** (the POS web portal — there's no API, so it's manual).

Rule we used: **highest price wins.** Where Revolut was already higher, the website was raised to match — nothing for you to do. The only price actions left are where the till is currently *lower* than it should be.

---

## 1. Raise these 3 till prices (website is higher)

| Item (Revolut name) | Till now | Should be |
|---|---|---|
| Bagel (GF) | £9.00 | **£10.00** |
| Americano | £3.40 | **£3.50** |
| meatball pasta half | £6.00 | **£7.00** |

> If any of these £9 / £3.40 / £6 prices are actually *correct* and the website is wrong, tell me and I'll lower the website instead.

---

## 2. Fix typos

| Current | Should be |
|---|---|
| Breakfast Mffin | Breakfast Muffin |
| scrambled egg ciabata | Scrambled Egg Ciabatta |

---

## 3. Merge duplicate entries (pick one, delete the rest)

- **French Toast** — "french toast w/bacon & maple syrup" + "French Toast w/bacon and maple syrup"
- **Tortilla Omelette** — "omelette tortilla" + "Omelette Tortilla Bake"
- **Bingsu** — generic "Bingsu" £7 duplicates "bingsu small" £7
- **Goujons (no chips)** — "goujons" £6 duplicates "Chicken Goujons x3" £5 (website uses the £5 one)
- **Scone (GF)** — "scone (GF)" appears in two categories

---

## 4. Category cleanup (optional, lower priority)

Revolut has case-duplicate categories from inconsistent entry: "Coffee & Tea" + "coffee & tea", "lunch" + "Lunch", "breakfast" + "Breakfast & Brunch", etc. Merging them makes future exports cleaner. Also **36 items sit in "Uncategorised"** — worth filing into real categories.

The snack categories ("Bars", "Beverages", "Extra") are fine to leave — those are drinks/snacks/charge-lines that don't belong on the food menu.

---

## What changed on the website/database side

**Prices raised to match the till (menu was stale):**
- Lemon Meringue £5→£5.50, Raspberry Ginger Lemon Tea £4→£4.50, Matcha Tea £3.80→£4, Mocaccino £3.70→£3.80, Macaroon (GF) £2.60→£3, Crumble Cookie £4→£4.30, Chocolate Fudge Cake (GF) £5.30→£5.50, Snickers/Toblerone (GF) £4.60→£5, Baby Soft Serve £3→£3.50
- **Bingsu** all sizes: £6.50/£7.50/£8.50 → **£7/£8.50/£10**

**Added (sold at till, were missing online):** Banana Bread, Cookie Cake, Smoothie Bowl, Fried Rice, Ciabatta, Beetroot Belgium Waffle, Lemon Croissant, Pistachio Donut, Beef & Mince Pie, Side of Bacon, Creamy Matcha, Creamy Almond Coffee Dream (K), Chicken Goujons x3. *(All flagged for you to confirm descriptions/allergens.)*

**Filled in:** Sushi platter prices (8pc £12 → 50pc £70).

**Renamed:** "Apple Pie" → "Strawberry Apple Pie" (to match the till). *Confirm this is right.*

**Decisions made:**
- Kept the menu detailed (individual drink/dessert flavours) even though the till groups them into generic SKUs — better for customers.
- Kept Chicken Wings, Cheesecake, Homemade Ice-cream and Large Soft Serve on the menu (not in Revolut, but you confirmed they're still sold).
- 130 items are now linked to their exact Revolut name, so your *next* export will diff precisely instead of by guesswork.
