import { expect, test } from '@playwright/test'
import { loadComponent, openComponent, watchComponent } from '../support/harness'

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

// toBeVisible also passes for an element with opacity 0.
test('shows the dialog in front of the page', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  watchComponent(page, { filename: 'report.docx' })

  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveCSS('opacity', '1')
  await expect(dialog.getByText('File name')).toBeVisible()
  await expect(dialog.getByRole('textbox')).toHaveValue('report')
})

test('keeps a name without an extension as it is', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  watchComponent(page, { filename: 'report' })

  await expect(page.getByRole('textbox')).toHaveValue('report')
})

test('only removes the last extension', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  watchComponent(page, { filename: 'report.final.docx' })

  await expect(page.getByRole('textbox')).toHaveValue('report.final')
})

test('selects the whole name so typing replaces it', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  const closed = openComponent<RenameResult>(page, { filename: 'report.docx' })

  const name = page.getByRole('textbox')
  await expect(name).toHaveValue('report')
  await expect(name).toBeFocused()
  await page.keyboard.type('notes')
  await page.keyboard.press('Enter')

  expect(await closed).toEqual({ result: 'ok', value: 'notes' })
})

test('reports cancel when the cancel button is used', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  const closed = openComponent<RenameResult>(page, { filename: 'report.docx' })

  const name = page.getByRole('textbox')
  await expect(name).toHaveValue('report')
  await name.fill('annual report')
  await page.getByRole('button', { name: 'Cancel' }).click()

  expect(await closed).toEqual({ result: 'cancel', value: 'annual report' })
  await expect(name).toBeHidden()
})

test('closes on Escape without reporting a result', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  const dialog = watchComponent(page, { filename: 'report.docx' })

  const name = page.getByRole('textbox')
  await expect(name).toBeFocused()
  await expect(name).toHaveValue('report')
  await page.keyboard.press('Escape')

  await expect(name).toBeHidden()
  expect(dialog.reported).toBe(false)
})

test('closes on Escape when the editor stops the key on the document', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')
  await page.evaluate(() => {
    document.addEventListener('keydown', (event) => event.stopPropagation())
  })

  watchComponent(page, { filename: 'report.docx' })

  const name = page.getByRole('textbox')
  await expect(name).toBeFocused()
  await page.keyboard.press('Escape')

  await expect(name).toBeHidden()
})

for (const character of ['*', '+', ':', '"', '<', '>', '?', '|', '\\', '/']) {
  test(`stays open on a name with ${character}`, async ({ page }) => {
    await loadComponent(page, 'rename-dialog')

    const dialog = watchComponent(page, { filename: 'report.docx' })

    const name = page.getByRole('textbox')
    await expect(name).toHaveValue('report')
    await name.fill(`bad${character}name`)
    await page.getByRole('button', { name: 'OK' }).click()

    await expect(name).toBeVisible()
    expect(dialog.reported).toBe(false)
  })
}

test('accepts a corrected name after a rejected one', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  const closed = openComponent<RenameResult>(page, { filename: 'report.docx' })

  const name = page.getByRole('textbox')
  await expect(name).toHaveValue('report')
  await name.fill('bad*name')
  await page.keyboard.press('Enter')
  await expect(name).toBeVisible()
  await expect(name).toBeFocused()

  await name.fill('good name')
  await page.keyboard.press('Enter')

  expect(await closed).toEqual({ result: 'ok', value: 'good name' })
})

test('limits the name to maxLength', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  watchComponent(page, { filename: 'report.docx', maxLength: 8 })

  const name = page.getByRole('textbox')
  await expect(name).toHaveValue('report')
  await expect(name).toHaveAttribute('maxlength', '8')
})

test('moves focus with Tab from the name to the buttons', async ({ page }) => {
  await loadComponent(page, 'rename-dialog')

  watchComponent(page, { filename: 'report.docx' })

  const name = page.getByRole('textbox')
  await expect(name).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'OK' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused()
})
