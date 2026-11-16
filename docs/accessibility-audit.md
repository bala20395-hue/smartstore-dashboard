# Accessibility Baseline & Repository Architecture Audit

## Audit status

This file is a worksheet and preliminary source-code review, not a completed Lighthouse audit. Record scores, keyboard observations, and findings only after testing the selected public website in a real browser and saving evidence.

## Project architecture reviewed

- `client/`: semantic HTML, responsive CSS, browser UI, and API client.
- `server/`: Express server, REST endpoints, product validation, and demo data.
- `docs/`: architecture and evidence documentation.
- `tests/`: automated product-validation tests.

Request flow: browser UI → `client/src/js/api.js` → Express `/api/products` → JSON response → product table update.

## Website details — complete during the real audit

- Website name:
- Website URL:
- Date tested:
- Browser and version:
- Viewport / device:
- Auditor:

## Lighthouse procedure

1. Open the chosen public-facing website in Chrome.
2. Open Developer Tools (`F12`) and select **Lighthouse**.
3. Select Accessibility and the device mode.
4. Run the audit and save the report screenshot.
5. Record the exact score, failed audit names, affected elements, and URL.

- Accessibility score:
- Screenshot filename:
- Failed audits observed:
- Notes:

## Keyboard-only procedure

1. Reload the target website and do not use a mouse.
2. Use `Tab` and `Shift + Tab` to navigate.
3. Use `Enter` and `Space` to activate controls.
4. Confirm focus is visible and order is logical.
5. Open and close menus/dialogs using the keyboard; check for focus traps or lost focus.
6. Record exact controls and observed behavior.

- Keyboard test result:
- Evidence filename:
- Notes:


## Lighthouse result — initial desktop run (16 November 2026)

The user's captured Lighthouse report showed:
- Accessibility: **96**
- Best Practices: **100**
- SEO: **91**
- Contrast audit: **Background and foreground colors do not have a sufficient contrast ratio**
- Failing elements listed by Lighthouse: `p.muted`, `body`, and `p`

### Verified source-level cause and remediation

The light-theme CSS originally used:
- Muted foreground: `#687386`
- Page background: `#f4f6fa`
- Calculated contrast ratio for this pair: **4.43:1**, below the WCAG AA 4.5:1 threshold for normal text.

The light-theme muted token was changed to `#626d7d`. Its calculated contrast ratio against `#f4f6fa` is approximately **4.85:1**. The dark-theme muted token was not changed.

- Remediation commit: https://github.com/bala20395-hue/smartstore-dashboard/commit/6987860437e9c1b2c2c0a8572331ab6aec639732
- Initial Lighthouse screenshot: retain as `task02-lighthouse-desktop-before-fix.png`.
- Retest required: rerun Lighthouse after the new Render deployment is live and record the new score and any remaining failing elements. The original report also listed generic `body` and `p` nodes; confirm whether they remain in the retest rather than assuming this one token explains every item.


## Lighthouse retest — desktop after contrast remediation (16 November 2026)

The user's follow-up Lighthouse screenshot shows:
- Accessibility: **100**
- The earlier insufficient text contrast warning is no longer displayed in this report.
- Lighthouse still lists **10 additional items to manually check**. These are manual review prompts, not automated failures and not proof that the checks passed.

Retest evidence filename: `task02-lighthouse-desktop-after-fix.png`.

Manual keyboard, focus-order, visible-focus, dialog, accessible-name, and screen-reader-related checks remain to be performed and documented separately. Do not mark them passed based on the Lighthouse score alone.


## Keyboard-only test — product dialog focus flow

Observed manually on the deployed SmartStore interface in Chrome on 16 November 2026:

- The Add product button displayed a visible keyboard focus indicator.
- Pressing Enter opened the product dialog.
- Initial focus moved to the Product name field.
- Pressing Shift+Tab from the first field moved focus to the dialog's Close button, which displayed a visible focus indicator.
- Pressing Enter on Close dismissed the dialog.
- Focus returned to the Add product button after dismissal.

Result: **the tested product-dialog open/close focus flow passed**. This does not by itself verify every keyboard check (search, selects, edit/delete actions, logical tab order throughout the whole page, screen-reader announcements, and focus behavior for all controls). Continue those tests separately.

Evidence filenames:
- `task02-keyboard-dialog-open.png`
- `task02-keyboard-dialog-close-focus-return.png`

## Five verified findings

Do not invent findings. Each item must include real evidence and a practical remediation.

### Finding 1
- Issue:
- Evidence (URL, element, screenshot):
- User impact:
- Severity: Critical / High / Medium / Low
- Remediation:
- Priority: P0 / P1 / P2 / P3

### Finding 2
- Issue:
- Evidence:
- User impact:
- Severity:
- Remediation:
- Priority:

### Finding 3
- Issue:
- Evidence:
- User impact:
- Severity:
- Remediation:
- Priority:

### Finding 4
- Issue:
- Evidence:
- User impact:
- Severity:
- Remediation:
- Priority:

### Finding 5
- Issue:
- Evidence:
- User impact:
- Severity:
- Remediation:
- Priority:

## SmartStore source-code review notes (not Lighthouse findings)

- Product dialog focus returns to the control that opened it, including the relevant Edit button.
- Product form inputs reference inline errors and update `aria-invalid`.
- Product records use PostgreSQL when `DATABASE_URL` is configured. If the variable is absent, the application deliberately falls back to in-memory demonstration data. LocalStorage is only a browser cache, not shared durable storage.

Re-run browser keyboard testing after the deployed changes are live.

## Evidence checklist

- [ ] Lighthouse screenshot and score
- [ ] Keyboard-only navigation notes and screenshot
- [ ] Five verified findings with evidence
- [ ] Severity and remediation priority for each
- [ ] Architecture diagram / request flow
- [ ] Retest results
