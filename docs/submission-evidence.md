# RABTECH Submission Evidence Register

## Project links

- GitHub: https://github.com/bala20395-hue/smartstore-dashboard
- Live app: https://smartstore-dashboard-i1t1.onrender.com
- Health endpoint: https://smartstore-dashboard-i1t1.onrender.com/health

## Deliverables

| Task | Expected evidence | Current status |
|---|---|---|
| 02 — Accessibility and architecture audit | Lighthouse screenshot/score, keyboard notes, five evidence-backed issues with severity/remediation, architecture tree | Desktop and mobile Lighthouse screenshots from 16 November 2026 both show Accessibility 100 (mobile emulation 390 × 844). Save them as `task02-lighthouse-desktop-after-fix.png` and `task02-lighthouse-mobile.png`; remaining keyboard/manual checks and five evidence-backed findings are still required. |
| 03 — Semantic HTML5 and accessible components | W3C validator result, semantic layout/form/table screenshots | Semantic markup and accessible form associations are implemented. Capture the validator result. |
| 04 — Responsive CSS architecture | Screenshots at 320px, 768px, 1024px, 1440px; no page-level horizontal overflow | Responsive CSS is implemented. Capture viewport evidence. |
| 05 — JavaScript DOM and REST API | Search/filter/sort/CRUD screenshots and GET/POST/PUT/DELETE evidence | Features and validation tests are present. Capture genuine deployed test evidence. |
| 06 — Capstone and deployment | GitHub URL, live URL, README, architecture diagram, final feature checks, persistent state | GitHub and Render deployment are available. PostgreSQL adapter is implemented; set Render `DATABASE_URL` and test data across restart before marking persistence complete. |



## W3C HTML validation — successful retest (17 November 2026)

The user's W3C Nu HTML Checker screenshot for `https://smartstore-dashboard-i1t1.onrender.com` shows the green result:

**“Document checking completed. No errors or warnings to show.”**

This is the post-remediation retest after adding semantic `h2` headings to the three dashboard statistic cards.

Result: **W3C Nu HTML validation passed with zero reported errors and zero reported warnings**.

Evidence filename: `task03-html-validator-zero-errors.png`.

## Responsive viewport check — initial 320px pass (16 November 2026)

The user's Chrome device-emulation screenshot shows the viewport set to **320 × 700 CSS pixels**. The dashboard summary cards appear stacked in a single column at this width, consistent with the mobile CSS layout. This visual screenshot alone does not prove the absence of document-level horizontal overflow; record that result only after checking `document.documentElement.scrollWidth` against `clientWidth`.

Evidence filename: `task04-320px.png`.


## Responsive viewport check — 320px product list

The user's Chrome responsive preview screenshot shows the product table adapting into stacked product cards at a 320 CSS-pixel viewport width. The visible Desk Lamp card displays Product, Category, Price, Stock, and Actions, with both Edit and Delete controls visible inside the card.

This is visual evidence that the product list adapts to a narrow layout. It does not by itself prove that the entire document has no horizontal overflow; the document width check should still be completed separately.

Evidence filename: `task04-320px-product-cards.png`.


## Responsive viewport check — 768px tablet layout

The user's Chrome responsive-emulation screenshot shows the viewport width set to **768 CSS pixels**. In the visible Product Management section:
- The Search products field spans the first full row.
- Category and Sort by controls appear side-by-side.
- The Add product button remains visible alongside the section heading.

This is consistent with the tablet CSS layout. The screenshot is a partial viewport capture; continue scrolling through the product list and check for clipping/overflow before marking the full 768 × 1024 test complete.

Evidence filename: `task04-768px.png`.


## Responsive viewport check — 1024px layout (partial visual check)

The user's Chrome responsive-emulation screenshot shows the viewport toolbar set to **1024 × 768 CSS pixels**. In the visible portion:
- The navigation remains on one horizontal row.
- Dashboard summary cards appear side by side.
- The dashboard content remains within the preview width.

The screenshot captures only the upper portion of the page, so the full product-management area and the complete 1024px page-width/overflow behavior still need to be checked by scrolling through the page.

Evidence filename: `task04-1024px.png`.


## Responsive viewport check — 1440px desktop layout (partial visual check)

The user's Chrome responsive-emulation screenshot shows the viewport toolbar set to **1440 × 900 CSS pixels**. In the visible preview:
- SmartStore navigation remains horizontal.
- The dashboard summary cards appear in a multi-column layout.
- The central page container is centered within the desktop viewport.

The browser preview is physically clipped by the available DevTools area; only the first two summary cards are visible in this capture. Use Fit to window or hide DevTools and capture the full width before confirming the entire desktop layout and checking horizontal overflow.

Evidence filename: `task04-1440px.png`.


### Responsive viewport check — 1440px desktop product-management view

The user's Chrome responsive-emulation screenshot shows **1440 × 900 CSS pixels** with Fit to window enabled. The full Product Management area is visible, including:
- Add Product button
- Search products input
- Category and Sort controls
- All six product records
- Edit and Delete actions for each record
- Result count and footer

The controls and product list are visually contained within the page at this desktop viewport. A programmatic document-width check has not yet been captured, so do not claim a measured no-overflow result from this screenshot alone.

Evidence filename: `task04-1440px-product-management.png`.


## W3C HTML validation — initial result and source remediation (17 November 2026)

The user's W3C Nu HTML Checker screenshot shows three **warnings** and no error messages visible in the supplied capture. All three warnings report: “Article lacks heading”, pointing to the three dashboard summary `article.stat-card` elements (original source lines 27–29).

Source remediation committed:
- Each statistic article now has a visible semantic `h2.stat-label` heading: Total products, Total stock, Catalog value.
- CSS preserves the existing compact statistic-label appearance for the new headings.
- HTML commit: https://github.com/bala20395-hue/smartstore-dashboard/commit/89d892d01301c1c76ca1843a84769622bbdc5576
- CSS commit: https://github.com/bala20395-hue/smartstore-dashboard/commit/735810c8268c3a802684abf34032845b02788354

Retest required after Render deploys these commits: run the W3C validator again and record the actual error and warning counts. The initial screenshot alone is not evidence of zero errors or a clean final validation.

## Recommended screenshot names

- `task02-lighthouse-accessibility.png` (initial score 96)
- `task02-lighthouse-desktop-after-fix.png` (retest score 100)
- `task02-keyboard-navigation.png`
- `task03-html-validator.png`
- `task03-semantic-dashboard.png`
- `task04-320px.png`
- `task04-768px.png`
- `task04-1024px.png`
- `task04-1440px.png`
- `task05-product-crud.png`
- `task05-api-get-post-put-delete.png`
- `task06-live-deployment.png`
- `task06-github-repository.png`
- `task06-postgres-persistence-after-restart.png`

Do not mark evidence captured until the actual screenshot or test output is saved.

## Final test record

- Audit website and date:
- Lighthouse accessibility score:
- Keyboard result:
- W3C validator error count:
- Responsive viewport results:
- REST API CRUD result:
- GitHub Actions result:
- PostgreSQL configured in Render: Yes / No
- Persistence verified after service restart: Yes / No
- Live deployment smoke test:
- Mentor feedback:
