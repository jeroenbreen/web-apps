import { expect, test } from '@playwright/test'
import { loadComponent, watchComponent } from '../support/harness'

function setFlag(page: import('@playwright/test').Page, name: string, value: string) {
  return page.addInitScript(([key, flag]) => localStorage.setItem(key, flag), [name, value])
}

test('marks a Vue component when highlighting is on', async ({ page }, testInfo) => {
  await setFlag(page, 'eo-vue-islands-highlight', '1')
  await loadComponent(page, 'rename-dialog')

  watchComponent(page, { filename: 'report.docx' })

  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveCSS('opacity', '1')
  const expected = testInfo.project.name === 'vue' ? 'solid' : 'none'
  await expect(dialog).toHaveCSS('outline-style', expected)
})

test('does not mark anything by default', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  watchComponent(page, { filename: 'report.docx' })

  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveCSS('opacity', '1')
  await expect(dialog).toHaveCSS('outline-style', 'none')
})

test('localStorage overrides the default', async ({ page }) => {
  await setFlag(page, 'eo-vue-islands', '0')
  await loadComponent(page, 'rename-dialog')

  watchComponent(page, { filename: 'report.docx' })

  await expect(page.getByRole('textbox')).toHaveValue('report')
  await expect(page.locator('.eo-vue-island')).toHaveCount(0)
})
