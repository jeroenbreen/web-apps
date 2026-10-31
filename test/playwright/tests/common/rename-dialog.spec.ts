import { expect, test } from '@playwright/test'
import { loadComponent, openComponent } from '../support/harness'

type RenameResult = { result: 'ok' | 'cancel'; value: string }

test('renames a file and reports the new name without its extension', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  const closed = openComponent<RenameResult>(page, { filename: 'report.docx' })

  const name = page.getByRole('textbox')
  await expect(name).toHaveValue('report')
  await expect(name).toBeFocused()

  await name.fill('annual report')
  await page.getByRole('button', { name: 'OK' }).click()

  expect(await closed).toEqual({ result: 'ok', value: 'annual report' })
  await expect(name).toBeHidden()
})
