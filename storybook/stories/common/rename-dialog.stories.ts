import type { Meta, StoryObj } from '@storybook/html-vite'
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test'
import { loadBackbone } from '../../.storybook/backbone'

type RenameDialogArgs = {
  filename: string
  maxLength?: number
  handler: (result: 'ok' | 'cancel', value: string) => void
}

type Dialog = { show(): void; close(): void; isVisible(): boolean }

declare const Common: {
  Views: { RenameDialog: new (options: RenameDialogArgs) => Dialog }
}

let dialog: Dialog | undefined

function closeDialog() {
  if (dialog?.isVisible()) dialog.close()
  dialog = undefined
}

// Opens the dialog the way controller/LeftMenu.js does.
function openDialog({ filename, maxLength, handler }: RenameDialogArgs) {
  closeDialog()
  const next = new Common.Views.RenameDialog({ filename, maxLength, handler })
  next.show()
  dialog = next
}

const meta: Meta<RenameDialogArgs> = {
  title: 'Common/RenameDialog',
  args: {
    filename: 'report.docx',
    handler: fn(),
  },
  argTypes: {
    filename: { control: 'text' },
    maxLength: { control: 'number' },
    handler: { table: { disable: true } },
  },
  loaders: [
    () => loadBackbone(
      [
        'common/main/lib/util/utils',
        'common/main/lib/component/Window',
        'common/main/lib/component/InputField',
      ],
      ['common/main/lib/view/RenameDialog'],
    ),
  ],
  beforeEach: () => closeDialog,
  render: (args) => {
    const reopen = document.createElement('button')
    reopen.textContent = 'Open dialog'
    reopen.style.margin = '16px'
    reopen.addEventListener('click', () => openDialog(args))

    openDialog(args)
    return reopen
  },
}

export default meta

type Story = StoryObj<RenameDialogArgs>

export const Default: Story = {}

export const WithoutExtension: Story = {
  args: { filename: 'report' },
}

export const MaxLength: Story = {
  args: { maxLength: 8 },
}

export const InvalidName: Story = {
  play: async ({ args }) => {
    const page = within(document.body)
    const name = page.getByRole('textbox')
    // Wait for the opening animation and the delayed value.
    await waitFor(() => expect(name).toHaveValue('report'))
    await waitFor(() => expect(name).toBeVisible())

    await userEvent.clear(name)
    await userEvent.type(name, 'bad*name')
    // InputField reads the value on blur.
    await fireEvent.blur(name)
    await userEvent.click(page.getByRole('button', { name: 'OK' }))

    await expect(name).toBeVisible()
    await expect(args.handler).not.toHaveBeenCalled()
  },
}
