# SmartStore Manual Test Guide

Test the live app at https://smartstore-dashboard-i1t1.onrender.com. A free Render service may need time to wake after inactivity.

## UI checks

1. Confirm that the current product list loads from the server. Do not assume a fixed product count; records may be added during testing.
2. Search for `Mouse`.
3. Filter by category.
4. Try each sort option.
5. Add a temporary product: Wireless Headphones / Electronics / 2499 / 20.
6. Edit its stock to 21.
7. Delete the temporary product.
8. Toggle dark mode and refresh.
9. Test widths 320px, 768px, 1024px, and 1440px; check page-level horizontal scrolling.
10. Use keyboard-only navigation on search, filters, dialog, and action buttons.

## API checks (PowerShell)

```powershell
$base = "https://smartstore-dashboard-i1t1.onrender.com"
Invoke-RestMethod "$base/health"
Invoke-RestMethod "$base/api/products"
```

Create:

```powershell
$body = @{ name="API Test Product"; category="Testing"; price=499; stock=10 } | ConvertTo-Json
$created = Invoke-RestMethod -Method Post -Uri "$base/api/products" -ContentType "application/json" -Body $body
$created
```

Update:

```powershell
$update = @{ name="API Test Product Updated"; category="Testing"; price=599; stock=12 } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "$base/api/products/$($created.id)" -ContentType "application/json" -Body $update
```

Delete:

```powershell
Invoke-RestMethod -Method Delete -Uri "$base/api/products/$($created.id)"
```

## Evidence

Capture actual browser screenshots and command output. Do not record a check as passed until it has been performed. When `DATABASE_URL` is configured, product records are stored in PostgreSQL and persist across service restarts. Without `DATABASE_URL`, the app uses in-memory demo records that reset when the server process restarts. LocalStorage is only a browser-side cache.
