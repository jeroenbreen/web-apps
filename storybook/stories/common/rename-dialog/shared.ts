import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test'

export type RenameHandler = (result: 'ok' | 'cancel', value: string) => void

export const argTypes = {
  filename: { control: 'text' },
  maxLength: { control: 'number' },
  handler: { table: { disable: true } },
} as const

// The dialog renders into the body, outside the story root.
async function findName() {
  const page = within(document.body)
  const name = page.getByRole('textbox')
  // Wait for the opening animation and the delayed value.
  await waitFor(() => expect(name).toHaveValue('report'))
  await waitFor(() => expect(name).toBeVisible())
  return { page, name }
}

export async function typeLongName() {
  const { name } = await findName()

  await userEvent.clear(name)
  await userEvent.type(name, 'annual report')

  await expect(name).toHaveValue('annual r')
}

export async function submitInvalidName(handler: RenameHandler) {
  const { page, name } = await findName()

  await userEvent.clear(name)
  await userEvent.type(name, 'bad*name')
  // The Backbone InputField reads the value on blur.
  await fireEvent.blur(name)
  await userEvent.click(page.getByRole('button', { name: 'OK' }))

  await expect(name).toBeVisible()
  await expect(handler).not.toHaveBeenCalled()
}
