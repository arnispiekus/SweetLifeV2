# Revolut POS Product Catalog API Research

**Research date:** 2026-05-21  
**Purpose:** Determine if Supabase can be kept in sync with Revolut's product catalog so that when the café owner edits items/prices in Revolut, the website and PDF update automatically.

---

## 1. Bottom Line

**There is no public REST API for Revolut's POS product catalog.** The only machine-friendly path today is a one-way, manually-triggered CSV export from Revolut → parsed → merged into Supabase. Fully automated, event-driven sync is not currently possible.

---

## 2. What We Can Actually Do via API

### Revolut's published APIs (Business + Merchant)
Revolut has four documented, publicly-specced APIs (OpenAPI YAML on GitHub):

| API | What it covers |
|---|---|
| Business API | Accounts, payments, counterparties, FX, card management, webhooks |
| Merchant API | Orders, customers, payments, disputes, subscriptions, webhooks |
| Open Banking API | Account access + payment initiation (regulated) |
| Crypto Ramp API | Fiat-to-crypto flows |

**None of these APIs expose product catalog, POS menu items, categories, variants, modifiers, allergens, or images.** This was confirmed by inspecting the latest published OpenAPI YAML files (`merchant-2026-04-20.yaml`, `business.yaml`) in the official `revolut-engineering/revolut-openapi` GitHub repo.

### What the POS system does support (UI only, not API)
- Creating/editing products, categories, variants (sizes/flavours), modifiers (add-ons), images, tax rates — all via the Revolut POS **web portal** (not an API).
- **Bulk CSV import** — upload multiple products at once. Fields include: product name, category, price, modifiers, variations. Minimum required: name, category, price.
- **CSV is import-only** (adds new products); it does **not update existing products**.
- Catalog syncs to POS device on login, or manually via "Sync with web portal."

### Webhooks
Business API webhooks: `TransactionCreated`, `TransactionStateChanged`, `PayoutLinkCreated`, `PayoutLinkStateChanged`.  
Merchant API webhooks: order lifecycle events (`ORDER_COMPLETED`, `ORDER_CANCELLED`, etc.) and subscription/dispute events.  
**No product, catalog, or item change events exist in either webhook system.**

### Zapier / Make
Revolut's official Zapier integration supports: trigger on new transaction; action to find account. **No POS or catalog triggers/actions exist.**  
Make.com integration is similarly payment-focused.

---

## 3. What We Cannot Do

- **GET product catalog** — no endpoint to read products, categories, variants, or modifiers programmatically.
- **POST/PATCH/DELETE products** — no API to create, update price, or deactivate items.
- **Real-time webhooks for catalog changes** — Revolut does not emit events when a product is edited.
- **Allergen/tag fields via API** — allergens are not a documented field even in the CSV import template.
- **Image management via API** — images are web-portal-only.
- **CSV export via API** — there is no programmatic export endpoint; exports are done manually through the web UI.
- **Modifiers and variants via API** — only manageable through the web UI (or CSV import for new items).
- **Community libraries** — no npm/PyPI package covers POS catalog management because the underlying API does not exist. PyRevolut, revolut-python, and similar packages only wrap the financial APIs.

---

## 4. Recommended Architecture (Given Current Constraints)

**Pattern: Periodic manual CSV pull → diff → Supabase upsert**

Since Revolut does not expose a catalog API or webhooks, the least-friction option is:

1. **Café owner workflow**: After updating products in Revolut POS web portal, she exports the product catalog as CSV (Products → Export).
2. **Ingestion script**: A small script (Python or Node) parses the CSV, diffs it against Supabase, and upserts changed rows.
3. **Trigger**: Manual (she drops the CSV and clicks a button on a simple admin page), or semi-automated (she emails/uploads it to a watched folder → script fires).

**Why not poll Revolut's API?** There is no catalog endpoint to poll.

**Future-proofing note**: If Revolut ever publishes catalog API endpoints (their docs hint at POS web app product management being a growing area), the architecture switches to a scheduled GET poll + upsert, or webhook → Supabase Edge Function. Design Supabase schema now with a `revolut_product_id` column so the link is ready.

**Fields to track in Supabase from CSV**: product name, category, price, modifier set names, variant names/prices. Allergens and images will continue to be managed manually in Supabase only (Revolut CSV does not include these).

---

## 5. Key Links

1. **Revolut POS Product Management docs** — `https://developer.revolut.com/docs/guides/in-person-payments/pos/web-app/product-management`
2. **Revolut OpenAPI GitHub (all published specs)** — `https://github.com/revolut-engineering/revolut-openapi`
3. **Revolut Bulk CSV Import help** — `https://help.revolut.com/business/help/merchant-accounts/revolut-point-of-sale-pos/managing-your-catalog-with-revolut-pos/bulk-product-import-with-csv/`
4. **Revolut Webhook event reference (Merchant)** — `https://developer.revolut.com/docs/merchant/webhooks`
5. **Revolut Business API overview + plan requirements** — `https://developer.revolut.com/docs/business/business-api`

---

## 6. Open Questions (to confirm with café owner / Revolut support)

1. **Which Revolut Business plan is the café on?** API access (for payment/transaction features) requires Grow plan or above. POS itself may be available on lower plans.
2. **Can the Revolut POS web portal actually export the full catalog to CSV?** The bulk import template is downloadable, and the docs mention exporting existing products to understand the format — but confirm there is a dedicated "Export all products" button.
3. **Does the current CSV include all fields needed?** Specifically: modifier prices, variant prices, and whether allergens/tags are a column.
4. **How often does the owner update prices?** If it is once a month, a manual CSV workflow is totally fine. If it is daily, this pain is worth raising with Revolut support as a feature request.
5. **Ask Revolut support directly**: "Is there a product catalog REST API on your roadmap, and is there a beta programme?" — Revolut's POS is a relatively newer product line and undocumented endpoints may exist for enterprise/partner tiers.
6. **Northern Ireland / UK specifics**: Revolut Business is available in the UK. No evidence of any geo-restriction on POS features for Northern Ireland specifically. The post-Brexit situation (NI sits under both UK and EU regulatory regimes for some financial products) is relevant for Open Banking, not for POS catalog management.
