# RABTECH Submission Evidence Register

## Project links

- GitHub: https://github.com/bala20395-hue/smartstore-dashboard
- Live app: https://smartstore-dashboard-i1t1.onrender.com
- Health endpoint: https://smartstore-dashboard-i1t1.onrender.com/health

## Deliverables

| Task | Expected evidence | Current status |
|---|---|---|
| 02 — Accessibility and architecture audit | Lighthouse screenshot/score, keyboard notes, five evidence-backed issues with severity/remediation, architecture tree | Lighthouse Accessibility 100 on desktop and mobile (390 × 844). Five source-review findings are documented; focus contrast and live result announcements have fixes committed. Full tab-order and screen-reader retests remain. |
| 03 — Semantic HTML5 and accessible components | W3C validator result, semantic layout/form/table screenshots | Semantic header/nav/aside/main/section/article/footer landmarks, responsive sidebar navigation, labelled form controls, captioned table, and accessible modal dialog are in the repository. Earlier W3C run showed zero errors/warnings; **rerun W3C after the sidebar markup change** and capture an updated screenshot before final completion. |
| 04 — Responsive CSS architecture | Screenshots at 320px, 768px, 1024px, 1440px; no page-level horizontal overflow | CSS now includes design tokens, responsive sidebar/grid breakpoints, glassmorphism/backdrop blur, shadows, transitions, theme variables, and reduced-motion handling. The earlier four viewport/overflow checks predate the sidebar and latest CSS; repeat them on the updated deployment and save fresh screenshots before marking final responsive verification complete. |
| 05 — JavaScript DOM and REST API | Search/filter/sort/CRUD screenshots and GET/POST/PUT/DELETE evidence, public API preview | Existing inventory UI/API CRUD, search/filter/sort, LocalStorage cache, and 400/404 negative tests passed. Added a separate asynchronous DummyJSON public catalogue preview with loading skeletons, friendly error state, category tabs, search, and sorting. New external API preview requires a post-deployment browser retest and screenshot before final evidence is complete. |
| 06 — Capstone and deployment | GitHub URL, live URL, README, architecture diagram, final feature checks, persistent state | **Deployed and persistence verified:** public GitHub repo and Render app are live; Neon PostgreSQL data remained after a Render service restart. Evidence screenshot collection remains a user-side submission step. |



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


## Responsive viewport check — 1024 × 768 (visual review)

The user's two Chrome responsive-emulation screenshots both show **1024 × 768 CSS pixels**.

Dashboard screenshot:
- SmartStore logo and Dashboard / Products navigation are visible on one row.
- Summary cards render in a two-column layout, with the third card wrapping to the next row.

Product-management screenshot:
- Product Management heading and Add Product button are visible.
- Search occupies a full row; Category and Sort controls sit side by side.
- Product inventory shows all six products with category, price, stock, Edit, and Delete controls.

Result: **the dashboard and product-management areas were visually reviewed at 1024 × 768, and the visible controls fit within the captured viewport**. A separate programmatic document-level overflow measurement has not been captured, so do not claim a measured zero-overflow result from these screenshots alone.

Evidence filenames:
- `task04-1024px-dashboard.png`
- `task04-1024px-products.png`

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


## REST API CRUD verification — successful live run (17 November 2026)

The user's PowerShell screenshots from the deployed SmartStore API show the following sequence using one temporary API test product:

1. **GET** `/api/products`: returned the existing product list (six records were visible in the terminal output).
2. **POST** `/api/products`: created `API Test Product` in category `Testing`, price `499`, stock `10`, with ID `101a3b38-8038-47fc-956c-0af0a1b49274`.
3. **PUT** `/api/products/101a3b38-8038-47fc-956c-0af0a1b49274`: updated the same record to `API Test Product Updated`, price `599`, stock `12`.
4. **DELETE** the same ID: returned `Product deleted.`.

The terminal's final green line shows `API TESTING COMPLETED`. The test product was deleted; the screenshots do not indicate deletion of any existing catalogue product.

Result: **GET, POST, PUT, and DELETE API operations completed successfully in the observed live run**.

Evidence filenames:
- `task05-api-get-products.png`
- `task05-api-post-create.png`
- `task05-api-put-update.png`
- `task05-api-delete.png`


## REST API negative validation tests — successful live run (17 November 2026)

The user's PowerShell screenshot shows two negative tests against the deployed API:

1. **POST invalid product** with an empty product name returned HTTP **400** and the script printed `PASSED: Invalid product rejected`.
2. **PUT non-existent product ID** returned HTTP **404** and the script printed `PASSED: Missing product correctly rejected`.

The terminal shows `NEGATIVE TESTING COMPLETED`.

Result: **the API rejected the observed invalid create request and missing-record update request with the expected HTTP status codes**.

Evidence filename: `task05-api-negative-tests.png`.




## Page-level horizontal overflow check — 768px (17 November 2026)

The user ran the same Chrome DevTools expression at the **768 × 1024** responsive viewport:

`document.documentElement.scrollWidth > document.documentElement.clientWidth`

Observed result: **`false`**.

Interpretation: no page-level horizontal overflow was detected at the tested 768px viewport. This does not rule out internal overflow regions such as the product table's own scroller.


## Page-level horizontal overflow check — 1440px (17 November 2026)

The user ran the same Chrome DevTools expression at the **1440 × 900** responsive viewport:

`document.documentElement.scrollWidth > document.documentElement.clientWidth`

Observed result: **`false`**.

Interpretation: no page-level horizontal overflow was detected at the tested 1440px viewport. This does not rule out internal overflow regions such as the product table's own scroller.

## Page-level horizontal overflow check — 320px (17 November 2026)

The user ran the same Chrome DevTools expression at the **320 × 700** responsive viewport:

`document.documentElement.scrollWidth > document.documentElement.clientWidth`

Observed result: **`false`**.

Interpretation: no page-level horizontal overflow was detected at the tested 320px viewport. This does not rule out internal overflow regions such as the product table's own scroller.

## Page-level horizontal overflow check — 1024px (17 November 2026)

The user ran the following expression in Chrome DevTools Console at the **1024 × 768** responsive viewport:

`document.documentElement.scrollWidth > document.documentElement.clientWidth`

Observed result: **`false`**.

Interpretation: no page-level horizontal overflow was detected at the tested 1024px viewport. This does not rule out the product table's own internal horizontal scroller, and it does not establish results for other viewport widths.

Evidence/result: user-reported Console result on 17 November 2026.

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


## Final consolidated status — 17 November 2026

This section consolidates later retests and supersedes earlier preliminary notes above where they said that a check was still pending.

- **Task 02:** Lighthouse scores are 100 desktop and mobile. The user confirmed the full keyboard sequence passed, including visible focus through the navigation and product controls. Windows Narrator announced the updated result count after the user searched for `Mouse`. Five evidence-backed source findings are recorded in `docs/accessibility-audit.md`; two accessibility changes are committed. The current manual keyboard and tested screen-reader checks are recorded as passed; screenshot filing and deployment verification of the latest commits remain.
- **Task 03:** W3C Nu HTML Checker retest showed zero errors and zero warnings (17 November 2026).
- **Task 04:** Responsive visual checks were completed at 320, 768, 1024, and 1440 CSS pixels. The document overflow expression returned `false` at each tested width. Internal table scrolling, where present, is distinct from page-level overflow.
- **Task 05:** UI checks and live API CRUD were performed. The invalid POST returned 400 and the missing-record PUT returned 404. The automated validation suite contains seven tests.
- **Task 06:** Render app and GitHub repository are available. PostgreSQL persistence was verified after a Render service restart on 17 November 2026. The user still needs to save the actual screenshots into the course submission folder; the filenames in this register are naming suggestions, not files stored in the repository.

### Latest accessibility code commits

- Focus-indicator contrast: https://github.com/bala20395-hue/smartstore-dashboard/commit/963e27d871858ebc8e47b4cfd815b1aa68bff664
- Live result-count announcement: https://github.com/bala20395-hue/smartstore-dashboard/commit/5d5ec667196c2555de0d029b1a0088b7ef3dc711

### PostgreSQL persistence verification

On 17 November 2026, a temporary test product was created in the deployed app. The Render service was restarted, and the record remained visible; a Neon database query also confirmed the persisted row. The temporary API test product used for the separate CRUD test was deleted. Existing catalogue records were not deleted during those API checks.

Do not include or screenshot the value of `DATABASE_URL`; keep database credentials in Render's Environment settings.


## Screen-reader result-count announcement — 17 November 2026

The user tested the deployed application with Windows Narrator. After entering `Mouse` in the Search products field, Narrator announced the updated result count. This confirms the live result-count announcement for the tested search interaction.

This was a user-confirmed manual check; no audio recording or screenshot was provided. It does not represent a complete screen-reader audit of the whole dashboard.



## Full keyboard navigation check — 17 November 2026

The user confirmed the full keyboard-only navigation pass on the deployed dashboard: skip link, navigation links, theme toggle, Add Product, search, category, sort, and product-row Edit/Delete actions were reachable in a logical order with visible focus. This is a user-confirmed manual test; a screenshot of the entire tab sequence was not supplied.


## Task 03 — semantic layout update (17 November 2026)

Added a semantic `aside` workspace sidebar with a separately labelled `nav`. It links to the Dashboard overview and Product management sections. The sidebar uses a desktop left-column layout and switches to a compact two-link row on narrow screens.

- HTML commit: https://github.com/bala20395-hue/smartstore-dashboard/commit/e5ee52cdf0dd2e83a09a44e4524b4c1c354ecaf3
- CSS commit: https://github.com/bala20395-hue/smartstore-dashboard/commit/8eb08ef2a747b5d713340634b07ef357d8c47910
- Existing markup includes a skip link, header, navigation landmarks, main content, sections, summary articles, captioned product table, labelled form controls, fieldset/legend, validation attributes, and a native dialog.

The previous W3C result with zero errors/warnings predates the new sidebar markup. Run the Nu HTML Checker again against the newly deployed page before marking the post-sidebar validation as complete. The sidebar provides section navigation within the dashboard document; it does not create separate HTML documents.


## Task 04 — responsive design system update (17 November 2026)

Latest CSS update:
- Added spacing, typography, border-radius, and transition custom-property tokens alongside theme colors and shadows.
- Added translucent glass surfaces and backdrop blur to the top bar, sidebar, summary cards, and product panel.
- Added hover transitions/lift effects and reduced-motion handling.
- Adjusted the 768–1023px tablet layout to use a compact horizontal sidebar navigation and two-column statistics.
- Kept a one-column mobile statistics/form layout at narrow widths and full-width content inside the desktop grid.
- Preserved light and dark theme token sets.

CSS commit: https://github.com/bala20395-hue/smartstore-dashboard/commit/2f92cfe480b9ebfbc745f0e973be1aede519faed

### Required post-change evidence

The earlier screenshots and page-overflow checks were captured before the semantic sidebar was added. They must not be presented as validation of the latest CSS. After the Render deploy is live, capture fresh screenshots and run the document-level overflow expression at 320, 768, 1024, and 1440 CSS pixels.

Suggested filenames:
- `task04-320px-latest.png`
- `task04-768px-latest.png`
- `task04-1024px-latest.png`
- `task04-1440px-latest.png`

At each viewport, run:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```

Expected result for each viewport: `false`. Record only the values actually observed on the deployed latest build.


## Task 05 — public REST API integration added (17 November 2026)

A separate read-only External product catalogue preview was added to satisfy the public third-party API portion of the task while preserving the user's existing PostgreSQL catalogue.

Implementation:
- `client/src/js/api.js`: `getPublicProducts()` uses `async/await` and `fetch` against the DummyJSON products endpoint, requests a limited set of fields, checks the HTTP status, validates the response shape, and normalizes product fields.
- `client/src/js/app.js`: fetches on user action, renders cards safely with DOM APIs, builds category filter buttons, applies live search and sort, and displays status/error states.
- `client/index.html`: includes the External product catalogue section, search/sort controls, accessible category filter group, loading skeletons, and result count.
- `client/src/css/styles.css`: styles the catalogue cards, category tabs, and loading skeletons.
- Source: https://dummyjson.com/docs/products

The external API catalogue is a read-only sample preview. It does not write demo products into the user's Neon/PostgreSQL inventory. DummyJSON explicitly describes its product write examples as simulated rather than persistent.

Relevant commits:
- UI: https://github.com/bala20395-hue/smartstore-dashboard/commit/c846f707ce755e923a79702586dd73d5322b01b4
- API client: https://github.com/bala20395-hue/smartstore-dashboard/commit/7ddb4cf51c5fe6980e4b9a2447a499c7696e0b04
- UI logic: https://github.com/bala20395-hue/smartstore-dashboard/commit/e0a7ef285a6eb356541b50fe250f4a3433fbc66e
- Styling: https://github.com/bala20395-hue/smartstore-dashboard/commit/e53ef3d474c990e26929eecfbde26a5772c92207
- CI JavaScript syntax check: https://github.com/bala20395-hue/smartstore-dashboard/commit/45d965521dad6eb14262472f42ac93736c3e995c

GitHub Actions run 83 completed successfully, including the new `node --check` steps for `app.js` and `api.js`, plus the existing product validation test suite.

### Post-deployment manual verification still required

After Render deploys the latest commit:
1. Open the live app and scroll to **External product catalogue**.
2. Click **Fetch public products**.
3. Confirm 12 sample cards load from DummyJSON and the loading skeleton disappears.
4. Search for a term, choose a category tab, and change the sort order. Confirm the cards update without a page reload.
5. Verify the saved inventory above still has its original six database records; the public sample preview is read-only.
6. Capture a screenshot named `task05-public-api-preview.png`.

Do not mark the external API browser interaction as verified until the user confirms the deployed test.
