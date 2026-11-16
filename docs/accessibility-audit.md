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
- Product records remain in server memory only and reset after server restart/redeploy. A database is required for durable shared data.

Re-run browser keyboard testing after the deployed changes are live.

## Evidence checklist

- [ ] Lighthouse screenshot and score
- [ ] Keyboard-only navigation notes and screenshot
- [ ] Five verified findings with evidence
- [ ] Severity and remediation priority for each
- [ ] Architecture diagram / request flow
- [ ] Retest results
