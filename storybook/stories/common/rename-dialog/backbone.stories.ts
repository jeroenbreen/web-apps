import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { defineComponent, h, watch } from 'vue'
import { loadBackbone } from '../../../.storybook/backbone'
import { argTypes, submitInvalidName, typeLongName, type RenameHandler } from './shared'

type RenameDialogArgs = {
  filename: string
  maxLength?: number
  handler: RenameHandler
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
  title: 'Common/RenameDialog/Backbone',
  args: {
    filename: 'report.docx',
    handler: fn(),
  },
  argTypes,
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
  render: (args) => defineComponent({
    setup() {
      const open = () => openDialog(args)
      watch(() => [args.filename, args.maxLength], open, { immediate: true })

      return () => h('button', { style: { margin: '16px' }, onClick: open }, 'Open dialog')
    },
  }),
}

export default meta

type Story = StoryObj<RenameDialogArgs>

export const Default: Story = {}

export const WithoutExtension: Story = {
  args: { filename: 'notes' },
}

export const MaxLength: Story = {
  args: { maxLength: 8 },
  play: typeLongName,
}

export const InvalidName: Story = {
  play: ({ args }) => submitInvalidName(args.handler),
}
