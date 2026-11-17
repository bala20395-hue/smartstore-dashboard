# Accessibility and Architecture Audit

## Audit scope and current status

- Website: SmartStore Dashboard
- URL: https://smartstore-dashboard-i1t1.onrender.com
- Review dates: 16–17 November 2026
- Browser: Chrome on Windows (exact browser build was not recorded)
- Review type: Lighthouse, keyboard-only interaction checks, HTML validation, and source-code review

This is a combined accessibility and repository architecture review. The five findings below are evidence-backed source-review findings; they are not five Lighthouse failures. Two accessibility improvements have been committed. Three production-hardening items remain recommendations for a public demo deployment.

## Lighthouse results

### Desktop — 16 November 2026

The user's captured Lighthouse report showed:

- Accessibility: **100**
- Best Practices: **100**
- SEO: **91**
- The earlier insufficient text contrast warning was no longer shown after the muted-text color correction.
- Lighthouse listed 10 additional items for manual review. These are prompts for human checking, not 10 automated failures.

Evidence filename: `task02-lighthouse-desktop-after-fix.png`.

### Mobile — 16 November 2026

The user's captured Lighthouse report showed:

- Emulated viewport: **390 × 844 CSS pixels**
- Device mode: **Mobile**
- Accessibility: **100**
- Lighthouse listed 10 additional manual-review prompts.

Evidence filename: `task02-lighthouse-mobile.png`.

A score of 100 is not, by itself, proof of full WCAG conformance. Keyboard and assistive-technology checks remain important.

## Keyboard-only checks observed — 16–17 November 2026

The following interactions were observed in the deployed Chrome browser:

1. **Add Product dialog:** Add Product received visible keyboard focus. Enter opened the dialog and focus moved to Product name. Shift+Tab reached the Close button. Enter closed the dialog and focus returned to Add Product.
2. **Product actions:** Edit and Delete buttons for the Mechanical Keyboard row could receive visible keyboard focus. Delete was not activated; no catalogue product was removed during this focus check.
3. **Category filter:** The Category select received keyboard focus. Selecting Testing filtered the list to the DB Persistence Test record.
4. **Sort:** The Sort by select received focus. Selecting Price (low to high) displayed all six records in ascending price order: DB Persistence Test (₹123), Notebook Set (₹299), Wireless Mouse (₹799), Desk Lamp (₹1,199), USB-C Hub (₹1,499), Mechanical Keyboard (₹2,499).
5. **Search:** The Search products field received focus. Entering Mouse displayed Wireless Mouse and the result count changed to 1 of 6.

These checks cover the listed controls only. A complete screen-reader review and an end-to-end tab-order review have not been recorded.

## Five evidence-backed findings

Severity and priority describe the potential impact in the current public demo context. Findings 1 and 2 have source fixes committed; verify the deployed version after Render finishes deploying. Findings 3–5 are production-hardening recommendations, not Lighthouse failures.

### Finding 1 — Low-contrast custom keyboard focus indicator

- **Evidence:** The original `:focus-visible` rule used `outline: 3px solid #e0a400`. Its calculated contrast was approximately **2.05:1** against the light page background `#f4f6fa` and **2.22:1** against white surfaces.
- **User impact:** Keyboard users with low vision may have difficulty distinguishing which control currently has focus.
- **Guideline:** WCAG 2.2 SC 1.4.11 requires visual information identifying a focused component state to have at least 3:1 contrast against adjacent colors. Reference: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast
- **Severity / priority:** Medium / P1.
- **Remediation committed:** Added theme-specific focus tokens: `#244582` in the light theme and `#91b4ff` in the dark theme. Calculated contrast is at least **8.63:1** for the tested adjacent page/surface colors.
- **Commit:** https://github.com/bala20395-hue/smartstore-dashboard/commit/963e27d871858ebc8e47b4cfd815b1aa68bff664
- **Retest:** Confirm visible focus in both themes after deployment.

### Finding 2 — Dynamic product result count was not a live region

- **Evidence:** The original result-count paragraph was updated by `renderProducts()` in `client/src/js/app.js`, but its HTML element did not have live-region semantics.
- **User impact:** A screen-reader user changing search, category, or sort controls might not be informed that the number of displayed products changed.
- **Severity / priority:** Medium / P2.
- **Remediation committed:** Added `role="status"`, `aria-live="polite"`, and `aria-atomic="true"` to the result-count element.
- **Commit:** https://github.com/bala20395-hue/smartstore-dashboard/commit/5d5ec667196c2555de0d029b1a0088b7ef3dc711
- **Retest result (17 November 2026):** The user tested the deployed page with Windows Narrator. After entering `Mouse` in the Search products field, Narrator announced the updated product result count. **Screen-reader announcement check passed** for this search-result update.
- **Evidence:** User-confirmed manual Narrator test on the deployed site; no screen-reader recording or screenshot was supplied.
- **Retest scope:** This verifies the search-result count announcement. It is not a complete screen-reader audit of every page control or status message.

### Finding 3 — Product CRUD API has no authentication or authorization

- **Evidence:** `server/src/server.js` mounts `/api/products` directly to the products router. The GET, POST, PUT, and DELETE handlers in `server/src/routes/products.js` do not apply an authentication or authorization check.
- **User impact:** Anyone who can reach the public API can attempt to create, update, or delete catalogue records.
- **Severity / priority:** High / P1 before use with real business data; acceptable only as a clearly understood single-demo limitation.
- **Remediation recommendation:** Add authenticated user sessions or an API authorization layer, and restrict create/update/delete operations to an authorized role before production use.
- **Status:** Open — intentionally not added to this beginner capstone demo.

### Finding 4 — Public API has no request rate limiting

- **Evidence:** The Express application configures a JSON body-size limit but does not configure request-rate limiting middleware. No rate-limiting dependency is present in `server/package.json`.
- **User impact:** Repeated requests can consume application or database resources and affect availability.
- **Severity / priority:** Medium / P2 before wider public use.
- **Remediation recommendation:** Add a suitable rate limiter for API routes and consider provider-level abuse protection and monitoring.
- **Status:** Open — production-hardening recommendation.

### Finding 5 — Product-list endpoint has no pagination

- **Evidence:** The PostgreSQL list query in `server/src/routes/products.js` selects every product row and sorts the full result; it does not use a page size, limit, or cursor.
- **User impact:** Response size and query work can grow with catalogue size, increasing load time and memory use for larger stores.
- **Severity / priority:** Low / P3 for the current six-record demo; Medium for a large catalogue.
- **Remediation recommendation:** Add bounded pagination (for example, `limit` plus a page or cursor parameter), validate the requested page size, and add a corresponding UI navigation pattern.
- **Status:** Open — current demo catalogue is small.

## Earlier remediation history

### Insufficient text contrast — resolved

The initial desktop Lighthouse report (16 November 2026) showed Accessibility 96 and an insufficient background/foreground contrast warning. It listed `p.muted`, `body`, and `p`.

The light-theme muted token was changed from `#687386` to `#626d7d`. Against `#f4f6fa`, the calculated contrast changed from approximately **4.43:1** to **4.85:1**.

- Remediation commit: https://github.com/bala20395-hue/smartstore-dashboard/commit/6987860437e9c1b2c2c0a8572331ab6aec639732
- The later desktop Lighthouse screenshot showed Accessibility 100 and no longer displayed the earlier contrast warning.

### HTML validator warnings — resolved under Task 03

The initial W3C Nu HTML Checker capture showed three warnings: “Article lacks heading” for the three dashboard statistic articles. Each article was given a semantic `h2` heading, with CSS updated to preserve the compact appearance.

- HTML commit: https://github.com/bala20395-hue/smartstore-dashboard/commit/89d892d01301c1c76ca1843a84769622bbdc5576
- CSS commit: https://github.com/bala20395-hue/smartstore-dashboard/commit/735810c8268c3a802684abf34032845b02788354
- The user's later W3C screenshot (17 November 2026) showed: **“Document checking completed. No errors or warnings to show.”**

## Repository architecture summary

- `client/`: semantic HTML, responsive CSS, browser interactions, and API client.
- `server/`: Express server, product REST routes, validation, and PostgreSQL adapter.
- `tests/`: automated product-validation tests.
- `docs/`: architecture, deployment, audit, and submission evidence.

Request flow: browser UI → `client/src/js/api.js` → Express `/api/products` → validation and route handler → PostgreSQL when `DATABASE_URL` is configured, otherwise in-memory demo data → JSON response → rendered product table.

PostgreSQL persistence was configured for the Render deployment and verified by creating a record, restarting the Render service, and confirming the record remained in the database. Do not publish the connection string or credentials.

## Final manual retest — full keyboard sequence (17 November 2026)

The user confirmed that the full keyboard-only navigation check passed on the deployed page:

- Focus moved through the skip link, navigation links, theme button, Add Product control, Search products field, Category select, Sort by select, and product-row Edit/Delete actions.
- The user confirmed the focus sequence was logical and the focused controls remained visibly indicated.
- This is a user-confirmed manual result. No screenshot or video of the complete sequence was supplied.

Together with the Windows Narrator search-result announcement test and the earlier dialog open/close, filtering, sorting, and search checks, the recorded keyboard interactions have been exercised. This does not certify full WCAG conformance or replace testing with additional assistive technologies.

## Remaining verification

- [ ] Confirm the latest CSS and HTML commits are deployed on Render.
- [x] Retest visible focus in light and dark themes (user supplied screenshots).
- [x] Test result-count announcement with Windows Narrator (search query `Mouse`; updated count announced).
- [x] Complete the user's full keyboard tab-order review (user-confirmed; no full-sequence screenshot supplied).
- [ ] Save the actual screenshots in the course evidence folder.
- [ ] Treat authentication, rate limiting, and pagination as production-hardening work if the application moves beyond a demo.
