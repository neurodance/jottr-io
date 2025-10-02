import { test, expect } from '@playwright/test'
// TODO: Re-enable once mocked flow is stabilized in CI/dev servers
test.skip(true, 'Temporarily skipping investor demo E2E while mocks are refined')

// Investor demo: open editor page, enable adapter, set base URL, mock backend, then run generate→continue→review

test('editor harness end-to-end with mocked Integraph', async ({ page, baseURL }) => {
  const base = '/api'
  let genHits = 0
  let contHits = 0
  let revHits = 0

  // Route mocks for Integraph endpoints
  await page.route(`**${base}/workflows/jott-generate`, async (route) => {
    genHits++
    await route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json', 'x-correlation-id': 'corr-1' },
      body: JSON.stringify({
        status: 'ok',
        run_id: 'run-123',
        jott_id: 'jott-1',
        correlationId: 'corr-1',
        cardJson: {
          type: 'AdaptiveCard',
          version: '1.6',
          body: [{ type: 'TextBlock', text: 'Hello Investor' }],
        },
        continuationSuggestions: ['expand'],
      }),
    })
  })
  await page.route(`**${base}/workflows/jott-continue`, async (route) => {
    contHits++
    await route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json', 'x-correlation-id': 'corr-2' },
      body: JSON.stringify({
        status: 'ok',
        run_id: 'run-123',
        jott_id: 'jott-1',
        correlationId: 'corr-2',
        updatedCardJson: {
          type: 'AdaptiveCard',
          version: '1.6',
          body: [
            { type: 'TextBlock', text: 'Hello Investor' },
            { type: 'TextBlock', text: 'v2' },
          ],
        },
        suggestions: ['review'],
      }),
    })
  })
  await page.route(`**${base}/workflows/review-approve`, async (route) => {
    revHits++
    await route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json', 'x-correlation-id': 'corr-3' },
      body: JSON.stringify({ status: 'ok', run_id: 'run-123', jott_id: 'jott-1', correlationId: 'corr-3', nextStep: 'publish' }),
    })
  })

  // Enable adapter and set base URL before app loads
  await page.addInitScript(({ b }) => {
    localStorage.setItem('integraph.enabled', 'true')
    localStorage.setItem('integraph.baseUrl', b)
  }, { b: base })

  // Load editor
  await page.goto(new URL('/editor', baseURL).toString())
  await expect(page).toHaveURL(/\/editor/)

  // Generate
  await page.getByRole('button', { name: 'Generate' }).click()
  await expect.poll(() => genHits, { timeout: 5000 }).toBeGreaterThan(0)
  await expect(page.getByText(/Session: runId=run-123/)).toBeVisible()
  await expect(page.locator('code', { hasText: 'corr-1' })).toBeVisible()

  // Continue
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect.poll(() => contHits, { timeout: 5000 }).toBeGreaterThan(0)
  await expect(page.locator('code', { hasText: 'corr-2' })).toBeVisible()

  // Review Approve
  await page.getByRole('button', { name: 'Review Approve' }).click()
  await expect.poll(() => revHits, { timeout: 5000 }).toBeGreaterThan(0)
  await expect(page.locator('code', { hasText: 'corr-3' })).toBeVisible()
})
