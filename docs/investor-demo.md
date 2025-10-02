# Investor Demo (Playwright)

This Playwright script opens the editor harness and validates the route renders.

## Prereqs
- Node 20+
- Install dependencies:

```pwsh
npm ci
npx playwright install --with-deps chromium
```

## Run

```pwsh
# run unit tests (optional)
npm test

# run e2e
npm run e2e

# open HTML report
npm run e2e:report
```

The dev server is started via `vite preview` automatically by Playwright config.

## Notes
- The script currently verifies the editor route and disabled adapter message. Expand with end-to-end flows when the Integraph adapter is available in your environment.
