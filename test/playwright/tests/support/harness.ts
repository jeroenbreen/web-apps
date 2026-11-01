import type { Page } from '@playwright/test'

declare global {
  interface Window {
    harness: { open(options: unknown): Promise<unknown> }
  }
}

export async function loadComponent(page: Page, component: string) {
  // Fail on a load error instead of waiting for the test timeout.
  const loadError = new Promise<never>((_, reject) => page.once('pageerror', reject))
  await page.goto(`/test/playwright/harness/index.html?component=${component}`)
  await Promise.race([page.waitForFunction(() => window.harness !== undefined), loadError])
}

// The returned promise resolves once the component reports its result, so
// start it, drive the UI, and await it afterwards.
export function openComponent<T>(page: Page, options: unknown): Promise<T> {
  return page.evaluate((opts) => window.harness.open(opts), options) as Promise<T>
}

// For a test that ends with the component still open, or that checks it reports
// nothing. The page closing rejects the open call, which is expected here.
export function watchComponent(page: Page, options: unknown) {
  const status = { reported: false }
  openComponent(page, options).then(() => { status.reported = true }, () => {})
  return status
}
