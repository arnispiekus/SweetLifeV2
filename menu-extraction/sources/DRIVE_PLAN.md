# Google Drive Reorganisation Plan — Ruta (Mum's Drive)

> **Status:** DRAFT — for user review and approval. No operations have been executed.  
> **Scope:** Sweet Life–relevant folders only.  
> **Generated:** 2026-05-26 from `drive/ruta_mum/flat.json` (3,953 items).

---

## 1. Proposed New Structure

Target tree for the Sweet Life areas of Mum's Drive after cleanup:

```
📁 Sweet Life Menu Item Photos/          ← KEEP AS-IS (already well organised)
   📁 Signature Drinks/
      📁 Milk Tea/
      📁 Fruit Tea/
      (+ loose files: Cherry Velvet Sip.jpg, etc.)
   📁 Cakes, Cookies & Bites/
   📁 Lunch/
   📁 Breakfast & Brunch/
   📁 Create Your Own/
   📁 Gourmet Lattes/
   📁 Coffee & Tea/
   📁 Keto, Vegan & Gluten Free/
   📁 Bingsu/
   📁 Hot Desserts/
   📁 Beverages/
   📁 Salads/
   📁 Bakery & Pastries/
   📁 Shakes, Smoothies & Frappes/
   📁 Sushi (Pre-Order)/

📁 Sweet Life Menu/                      ← CONSOLIDATED (merge 3 menu folders + loose PDFs)
   📁 current/
      📁 Newry V2/                       ← 2× Newry V2 PDFs from Sweet Life Menu V2/
      📁 Drogheda V2/                    ← 2× Drogheda V2 PDFs + loose root PDF
      📁 Newry A5/                       ← 4× A5 PDFs from Sweet Life Menu Newry/
   📁 _archive/
      📁 pre-v2/                         ← 6× older PDFs from Sweet Life Menu/ + A0 prints
      📁 menu-newry-misc/                ← WhatsApp menu photo from Sweet Life Menu Newry/

📁 Sweet Life Images/                    ← RESTRUCTURED (currently messy)
   📁 brand-assets/                      ← logos, brand marks
   📁 deliveroo/                         ← professional Deliveroo listing shots (rename from "Deliveroo nuotraukos 2")
   📁 usb-library/                       ← USB Sweet Life Photo (45 items — high-value archive)
   📁 food/                              ← food stills from "sweet life images/Food/"
   📁 drinks/                            ← drink stills from "sweet life images/Drinks/"
   📁 bingsu/                            ← bingsu stills from "sweet life images/Bingsu/"
   📁 design-refs/                       ← Fivver assets + palete refs (design reference material)
   📁 _archive/
      📁 old-menu/                       ← from "sweet life images/old menu/" (8 items)
      📁 misc-2023/                      ← WhatsApp dumps + screenshots + .webarchive files

📁 Sweet Life Video/                     ← MINOR CLEANUP ONLY (structure already good)
   📁 Filtered/                          ← KEEP (54 sub-folders, edited IG-ready content)
   📁 Unfiltered/                        ← KEEP (raw footage)
   📁 Christmas/                         ← KEEP (seasonal)
   📁 Event 08/                          ← KEEP (event content)
   📁 Catering/                          ← KEEP (catering content)
   📁 Tiktok/                            ← KEEP (TikTok exports)
   📁 Cafe Interior/                     ← KEEP (interior shots)
   📁 JAM (video examples)/              ← KEEP (reference videos from JAM agency)
   📁 Saikat - Finished Videos/          ← KEEP (editor deliverables — confirm with user)
   📁 _unorganised/                      ← NEW: loose root MP4s/MOVs/HEICs moved here
   [LOGO/ merged into Sweet Life Images/brand-assets/]

📁 Sweet Life Business/                  ← NEW: consolidate loose root-level business docs
   📁 ops/                               ← weekly rotas, shift schedules, Week spreadsheets
   📁 finance/                           ← SumUp transaction reports, VAT files
   📁 slides/                            ← Sweet Life Slides + Copy of Sweet Life Slides
   📁 reference/                         ← Sweet Life Reference, Sweet Life Reference Maryna
   📁 print-assets/                      ← irland menu A0 copy.pdf, Sweet Life Main Menu A0 A2-4.pdf

📁 Sweet-Life-Amazon/                    ← KEEP (377 supplier docs, not menu work)
```

**Untouched folders** (leave completely alone):
- `/PJ Export LTD/` (1,133 items — separate business)
- `/Google Pixel 9 Pro XL/` (823 items — phone backup)
- `/Scotch hall/` (125 items)
- `/Saved from Chrome/` (12 items)
- `/Sportas/` (2 items)
- `/Creator Studio/` (6 items)

---

## 2. Move List

### 2a. Menu PDF consolidation

1. **RENAME:** `/Sweet Life Menu V2/` → `/Sweet Life Menu/`  
   *(Make the V2 folder the canonical menu folder and work forward from it)*

2. **MOVE:** `/Sweet Life Menu V2/Sweet Life Menu Newry V2 (resize).pdf`  
   → `/Sweet Life Menu/current/Newry V2/`  
   *(Latest Newry V2 — "resize" suffix suggests it's the print-ready version; 1 file)*

3. **MOVE:** `/Sweet Life Menu V2/Sweet Life Menu Newry V2 (2).pdf`  
   → `/Sweet Life Menu/current/Newry V2/`  
   *(Second Newry V2 iteration; 1 file)*

4. **MOVE:** `/Sweet Life Menu V2/Sweet Life Menu Newry V2 (1).pdf`  
   → `/Sweet Life Menu/_archive/pre-v2/`  
   *(Earliest Newry V2 draft; 1 file)*

5. **MOVE:** `/Sweet Life Menu V2/Sweet Life Menu Drogheda V2 (increased bleed) .pdf`  
   → `/Sweet Life Menu/current/Drogheda V2/`  
   *(Latest Drogheda V2 — "increased bleed" = print-ready; 1 file)*

6. **MOVE:** `/Sweet Life Menu V2/Sweet Life Menu Drogheda V2 (3).pdf`  
   → `/Sweet Life Menu/current/Drogheda V2/`  
   *(Second Drogheda V2 iteration; 1 file)*

7. **MOVE:** `/Sweet Life Menu Drogheda V2.pdf` (root)  
   → `/Sweet Life Menu/_archive/pre-v2/`  
   *(Older loose Drogheda PDF at root; 1 file)*

8. **MOVE (all 4 A5 PDFs):** `/Sweet Life Menu Newry/Breakfast + Food Menu A5.pdf`  
   `/Sweet Life Menu Newry/Light Breakfast + Food Menu A5.pdf`  
   `/Sweet Life Menu Newry/Coffee + Frappe Menu Newry (A5).pdf`  
   `/Sweet Life Menu Newry/Desserts + Drinks Menu NEWRY (A5).pdf`  
   → `/Sweet Life Menu/current/Newry A5/`  
   *(Current Newry A5 format menus — physically used in café; 4 files)*

9. **MOVE:** `/Sweet Life Menu Newry/WhatsApp Image 2024-01-09 at 22.27.18.jpeg`  
   → `/Sweet Life Menu/_archive/menu-newry-misc/`  
   *(Phone photo of menu board — possible reference; 1 file)*

10. **DELETE** (or MOVE to `_archive/pre-v2/`): `/Sweet Life Menu Newry/` folder  
    *(Now empty after moves above)*

11. **MOVE (all 6 older PDFs):** `/Sweet Life Menu/Untitled design.pdf`  
    `/Sweet Life Menu/Smoothie menu instagram post.pdf`  
    `/Sweet Life Menu/jpg2pdf.pdf.pdf`  
    `/Sweet Life Menu/0.0 MG (1).pdf`  
    `/Sweet Life Menu/Healthy Breakfast Available between 9.30-12.00.pdf`  
    `/Sweet Life Menu/Sweet Life Main Menu A0 A2-2.pdf`  
    → `/Sweet Life Menu/_archive/pre-v2/`  
    *(All pre-V2 exports — 6 files)*

12. **MOVE:** `/Sweet Life Main Menu A0 A2-4.pdf` (root)  
    `/irland menu A0 copy.pdf` (root)  
    → `/Sweet Life Business/print-assets/`  
    *(Large-format A0 print files; 2 files)*

---

### 2b. Sweet Life Images cleanup

13. **RENAME:** `/Sweet Life Images/Deliveroo nuotraukos 2/`  
    → `/Sweet Life Images/deliveroo/`  
    *(Rename from Lithuanian "nuotraukos" = photos; 18 files)*

14. **MOVE:** `/Sweet Life Images/SWEET LIFE_LOGO(PNG).png` (root-of-folder file)  
    → `/Sweet Life Images/brand-assets/`  
    *(Brand logo — 1 file)*

15. **MOVE:** `/Sweet Life Video/LOGO/SweetLifeLogoSOCIALS.png`  
    → `/Sweet Life Images/brand-assets/`  
    *(Social media logo currently buried in video folder; 1 file)*

16. **MOVE:** `/Sweet Life Images/sweet life images/USB Sweet Life Photo/` (45 items)  
    → `/Sweet Life Images/usb-library/`  
    *(High-value archive from USB transfer; promote out of double-nested path)*

17. **MOVE:** `/Sweet Life Images/sweet life images/Food/` (24 items)  
    → `/Sweet Life Images/food/`

18. **MOVE:** `/Sweet Life Images/sweet life images/Drinks/` (9 items)  
    → `/Sweet Life Images/drinks/`

19. **MOVE:** `/Sweet Life Images/sweet life images/Bingsu/` (8 items)  
    → `/Sweet Life Images/bingsu/`

20. **MOVE:** `/Sweet Life Images/sweet life images/Fivver/` (15 items)  
    `/Sweet Life Images/sweet life images/palete/` (10 items)  
    → `/Sweet Life Images/design-refs/`  
    *(Fiverr freelancer assets + colour palette refs — design references; 25 items)*

21. **MOVE:** `/Sweet Life Images/sweet life images/old menu/` (8 items)  
    → `/Sweet Life Images/_archive/old-menu/`

22. **MOVE (junk + misc):**  
    `/Sweet Life Images/sweet life images/WhatsApp Image 2023-08-28 at 21.47.45.jpeg`  
    `/Sweet Life Images/sweet life images/WhatsApp Image 2023-08-28 at 21.45.54.jpeg`  
    `/Sweet Life Images/sweet life images/Screenshot 2023-08-17 at 19.26.07.png`  
    `/Sweet Life Images/sweet life images/Screenshot 2023-08-16 at 21.09.24.png`  
    `/Sweet Life Images/sweet life images/Screenshot 2023-01-29 at 00.13.49.png`  
    `/Sweet Life Images/sweet life images/Grey Simple Poke Bowl Food Menu Instagram Post.webarchive`  
    `/Sweet Life Images/sweet life images/Yellow And Brown Bibimbap Menu Instagram Post (A4 Document).webarchive`  
    → `/Sweet Life Images/_archive/misc-2023/`  
    *(Old screenshots, WhatsApp dumps, browser archives — low value; 7 files)*

23. **DELETE:** `/Sweet Life Images/sweet life images/.DS_Store`  
    *(macOS metadata file — junk; 1 file)*

24. **DELETE (folder shell):** `/Sweet Life Images/sweet life images/` (now empty)  
    *(Remove the redundant nested folder once contents are promoted)*

---

### 2c. Sweet Life Video cleanup

25. **MOVE (36 loose root MP4s):** All UUID-named `.MP4` files at root (e.g. `588B6F60-….MP4`)  
    → `/Sweet Life Video/_unorganised/`  
    *(Likely Sweet Life IG content that escaped organisation; 14 UUID MP4s. Reason: UUID names match iOS/Android camera roll dumps — almost certainly café content)*

26. **MOVE (root MOV/HEIC):** `IMG_7930.MOV`, `IMG_7931.MOV`, `IMG_7932.MOV`, `IMG_7933.MOV`, `IMG_7934.HEIC`, `IMG_7935.MOV` (6 files), `IMG_1085.HEIC` through `IMG_1096.HEIC` (6 files)  
    → `/Sweet Life Video/_unorganised/`  
    *(Phone media at root — origin unclear but likely café; 12 files)*

27. **DELETE** (or leave): `/Sweet Life Video/LOGO/` folder shell  
    *(After SweetLifeLogoSOCIALS.png is moved to brand-assets/ in step 15)*

---

### 2d. Loose root-level Sweet Life documents → new folder

28. **MOVE:** `Sweet Life Slides` (presentation, root)  
    `Copy of Sweet Life Slides` (presentation, root)  
    → `/Sweet Life Business/slides/`  
    *(Café presentation/pitch decks; 2 files)*

29. **MOVE:** `Sweet Life Reference Maryna` (document, root)  
    `Sweet Life Reference ` (document, root)  
    → `/Sweet Life Business/reference/`  
    *(Staff reference documents; 2 files — see risks section)*

30. **MOVE:** `Sweet Life Order.pdf` (root)  
    → `/Sweet Life Business/ops/`  
    *(Supplier or catering order; 1 file)*

31. **MOVE:** `Missing Menu` (document, root)  
    → `/Sweet Life Business/reference/`  
    *(Unclear — possibly a "missing items from menu" working doc; 1 file)*

32. **MOVE (weekly rotas):** `Week 13 Newry`, `Week 13 Newry.xlsx`, `Week 18`, `Week Week 18.xlsx`, `Week 21 Newry`, `Week 35`, `Week 47 Newry.pdf` (×3 copies), `Week Week 24 Drogheda.xlsx`, `Newry Week 36 Newry.xlsx`, `Rota Template`, `Employee shift schedule`, `Weekly time sheet`  
    → `/Sweet Life Business/ops/`  
    *(Staff rotas and shift management; ~13 files — many duplicates)*

33. **MOVE (finance):** `20220818-MCK39TEP-Sumup-TransactionsReport (1)` through `(3)` (multiple formats), `20240501-20240630-MCK39TEP-transactions-report.xls`, `20240601-20240630-MDFE4MDX-transactions-report.csv`, `VAT_Final_Review` (×3), `VAT_Final_Review.csv`, `VAT_Correction_Menu.csv`, `download (2)`, `download (2).csv`, `download.csv`  
    → `/Sweet Life Business/finance/`  
    *(SumUp payment reports + VAT workbooks; ~15 files)*

34. **MOVE:** `Warning Drogheda`, `Warning Drogheda.docx`, `Copy of Warning Drogheda`, `Warning letter`  
    → `/Sweet Life Business/ops/hr/`  
    *(HR/staff management documents — see risks)*

---

### 2e. Explicit KEEPs

35. **KEEP:** `/Sweet Life Menu Item Photos/` — no changes. Already well-organised by section.

36. **KEEP:** `/Sweet Life Video/Filtered/` — well-curated, 54 named sub-folders.

37. **KEEP:** `/Sweet Life Video/Unfiltered/` — raw footage, don't touch.

38. **KEEP:** `/Sweet Life Video/Christmas/` — seasonal campaign content.

39. **KEEP:** `/Sweet Life Video/Catering/` — catering enquiry assets.

40. **KEEP:** `/Sweet Life Video/JAM (video examples)/` — agency reference videos.

41. **KEEP:** `/Sweet-Life-Amazon/` — 377 supplier invoices/docs, not menu work.

---

## 3. Archive Policy

**Rule:** Old versions of published menus are never deleted — only archived.

```
/Sweet Life Menu/_archive/
  /pre-v2/                    ← everything before the current V2 redesign
  /menu-newry-misc/           ← phone photos of physical menus
  /YYYY-MM/                   ← (future) when a new version supersedes current,
                                  move the old PDFs here with date folder
```

**Trigger for archiving current→ _archive:**  
When a new Canva export is added to `/current/Newry V2/` or `/current/Drogheda V2/`, move the previous file to `/_archive/YYYY-MM/` (month the replacement was uploaded). Never delete.

**Version naming convention going forward:**  
`Sweet Life Menu Newry V2 YYYY-MM-DD.pdf` — eliminates ambiguous `(1)`, `(2)`, `(resize)` suffixes.

---

## 4. Sharing to Sweet Life Work Drive

All sharing uses Drive's built-in **share** feature (no duplication of storage). Suggested folder grants from `Ruta - Mum` → `Sweet Life Work`:

| Folder | Permission | Rationale |
|---|---|---|
| `/Sweet Life Menu Item Photos/` | **Editor** | Dev/design team needs to add new photos and update image-to-DB matches |
| `/Sweet Life Menu/current/` | **Commenter** | Need read access + ability to annotate; new versions uploaded by Mum only |
| `/Sweet Life Menu/_archive/` | **Viewer** | Reference only |
| `/Sweet Life Images/brand-assets/` | **Viewer** | Logos needed for website/social assets; no edits needed |
| `/Sweet Life Images/deliveroo/` | **Viewer** | Deliveroo photo reference for DB matching |
| `/Sweet Life Images/usb-library/` | **Viewer** | High-res archive for future photography sessions |
| `/Sweet Life Video/Filtered/` | **Viewer** | Ad creative team needs access for repurposing; Mum stays owner |

**Do NOT share:**
- `/Sweet Life Business/` (finance, HR — private)
- `/Sweet Life Video/Unfiltered/` (raw footage — large, no immediate use for dev work)
- `/Sweet-Life-Amazon/` (supplier docs — not relevant)

---

## 5. Risks & Questions for the User

### 🔴 High priority — needs a decision before executing

**A. Drogheda A5 menus missing**  
`/Sweet Life Menu Newry/` has 4 Newry A5 PDFs (Breakfast+Food, Light Breakfast+Food, Coffee+Frappe, Desserts+Drinks). There are **no Drogheda A5 equivalents** in Drive. Are Drogheda A5s printed from the same V2 PDF, or are they separate files held elsewhere (Canva only)?

**B. "Sweet Life Reference Maryna"**  
This is a Google Doc at root level. "Maryna" is a person's name — this could be a staff reference letter or a character reference for immigration/visa purposes. Confirm whether it's sensitive before sharing the `/reference/` folder or moving to an accessible location.

**C. Loose root UUID MP4s — Sweet Life or personal?**  
There are 14 UUID-format MP4s at root (e.g. `588B6F60-….MP4`) and 12 `IMG_0*` MOV/HEIC files. These look like iPhone/Android camera roll dumps. Without viewing them it's impossible to confirm they're Sweet Life content. Propose moving to `_unorganised/` not deleting — but user should spot-check 2–3 before the batch move.

**D. SumUp transaction report MCK39TEP vs MDFE4MDX**  
Two different SumUp terminal IDs appear in the finance files (MCK39TEP and MDFE4MDX). These could be Newry and Drogheda terminals respectively. Worth confirming before creating a `/finance/` folder — they may belong in separate Newry/Drogheda sub-folders for accounting purposes.

### 🟡 Medium priority — flag but not blocking

**E. `Fivver/` spelling**  
The folder is named `Fivver` (double-v) — this is likely Fiverr (the freelance platform). Contents look like commissioned design assets (15 items). Recommend renaming to `Fiverr-assets` when promoting to `design-refs/` so the origin is clear.

**F. `Saikat - Finished Videos/`**  
This subfolder in `/Sweet Life Video/` has a `POSTED` sub-folder (empty). "Saikat" appears to be a video editor. Clarify: is Saikat still active? If not, archive the folder.

**G. `JAM (video examples)/`**  
13 example videos labelled `JAM VIDEO 001–013`. Are these assets owned by Sweet Life (commissioned work) or reference samples from the JAM agency that shouldn't be stored long-term?

**H. `.webarchive` files in sweet life images**  
Two Safari web archives saved from browser: `Grey Simple Poke Bowl Food Menu Instagram Post.webarchive` and `Yellow And Brown Bibimbap Menu Instagram Post (A4 Document).webarchive`. Likely saved as design references. Recommend archiving; confirm before deleting.

**I. `Hot Desserts/` folder in Menu Item Photos**  
Contains both Golden Toast variants (`*GT.webp`) and Hot Desserts (waffles, pancakes, crepes). The DB has these as separate sections (`hot-desserts` vs `golden-toast`). Should the GT images stay in `Hot Desserts/` or be split into a dedicated `Golden Toast/` subfolder?

**J. Duplicate copies at root**  
Several files have obvious duplicates at root (e.g. `Week 47 Newry.pdf` appears 3×, `Meistrelio darbai.pdf` appears 2×, `signature-page-4294119_copy.pdf` appears 2×). Recommend keeping the most recently modified copy and deleting the others — but only after user confirms they're identical.

### 🟢 Low priority — informational

**K. `Sweet Life Main Menu A0 A2-4.pdf` vs `A0 A2-2.pdf`**  
Both are large-format print PDFs. The `-4` version is at root, the `-2` version is inside `/Sweet Life Menu/`. Both should be archived — just noting there are at least 4 iterations of the A0 print format.

**L. `_model_googlevo3_202509262220_xm13i.mp4`**  
This looks like a Veo 3 AI-generated video (Google's model). It's sitting in `/Sweet Life Video/` root. Treat like Filtered content — move to a new `AI-generated/` sub-folder, or to `_unorganised/` for now.

**M. ElevenLabs audio files**  
`/Sweet Life Video/ElevenLabs_Text_to_Speech_audio.mp3` and `…audio-2.mp3` — AI voiceover files for videos. These should probably live in `/Sweet Life Video/` but in a named sub-folder, e.g. `audio/`.
