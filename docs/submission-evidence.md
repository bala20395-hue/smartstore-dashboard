# RABTECH Submission Evidence Register

## Project links

- GitHub: https://github.com/bala20395-hue/smartstore-dashboard
- Live app: https://smartstore-dashboard-i1t1.onrender.com
- Health endpoint: https://smartstore-dashboard-i1t1.onrender.com/health

## Deliverables

| Task | Expected evidence | Current status |
|---|---|---|
| 02 — Accessibility and architecture audit | Lighthouse screenshot and score, keyboard-only test notes, five evidence-backed issues with severity and remediation, architecture tree | Worksheet and architecture documentation are present. Genuine browser audit evidence is still required. |
| 03 — Semantic HTML5 and accessible components | W3C validator result, semantic layout/form/table screenshots | Semantic markup is implemented. Capture the validator result. |
| 04 — Responsive CSS architecture | Screenshots at 320px, 768px, 1024px, and 1440px; no page-level horizontal overflow | Responsive CSS is implemented. Capture viewport evidence. |
| 05 — JavaScript DOM and REST API | Search/filter/sort/CRUD screenshots and GET/POST/PUT/DELETE evidence | Features are implemented. Capture genuine test evidence. |
| 06 — Capstone and deployment | GitHub URL, live URL, README, architecture diagram, final feature checks | Repository and Render deployment are available. Durable database persistence is not configured. |

## Suggested screenshot filenames

- `task02-lighthouse-accessibility.png`
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

Do not mark evidence captured until the actual screenshot or test output is saved.

## Final test record

- Audit website and date:
- Lighthouse accessibility score:
- Keyboard test result:
- W3C validator error count:
- Responsive viewport results:
- REST API CRUD result:
- Live deployment smoke test:
- Mentor feedback:

## Known limitation

The Express product collection currently uses in-memory demonstration data. It resets after server restart/redeployment. Browser LocalStorage is only a per-browser cache, not durable shared persistence. Add a database before claiming durable persistence is complete.
