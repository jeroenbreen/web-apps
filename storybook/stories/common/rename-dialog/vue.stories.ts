import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { defineComponent, h, ref, watch } from 'vue'
import RenameDialog from '../../../../apps/common/main/vue/dialogs/RenameDialog.vue'
import { loadBackbone } from '../../../.storybook/backbone'
import { argTypes, submitInvalidName, typeLongName, type RenameHandler } from './shared'

type RenameDialogArgs = {
  filename: string
  maxLength?: number
  handler: RenameHandler
}

// The real labels come from the translations on the Backbone view.
const labels = {
  name: 'File name',
  invalidName: 'The file name cannot contain any of the following characters: *+:"<>?|\\/',
  ok: 'OK',
  cancel: 'Cancel',
}

const meta: Meta<RenameDialogArgs> = {
  title: 'Common/RenameDialog/Vue',
  args: {
    filename: 'report.docx',
    handler: fn(),
  },
  argTypes,
  // EoDialog reports to Common.NotificationCenter.
  loaders: [() => loadBackbone()],
  render: (args) => defineComponent({
    setup() {
      const open = ref(true)
      // A new key reopens the dialog, it reads filename once.
      const key = ref(0)
      const reopen = () => {
        key.value++
        open.value = true
      }
      watch(() => [args.filename, args.maxLength], reopen)

      return () => [
        h('button', { style: { margin: '16px' }, onClick: reopen }, 'Open dialog'),
        open.value && h(RenameDialog, {
          key: key.value,
          filename: args.filename,
          maxLength: args.maxLength,
          labels,
          onResult: args.handler,
          onClose: () => { open.value = false },
        }),
      ]
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
