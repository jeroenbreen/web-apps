/*
 * SPDX-FileCopyrightText: 2026 Euro-Office contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createApp, type Component } from 'vue'
import RenameDialog from './dialogs/RenameDialog.vue'

// A dialog receives `onClose` and calls it when it is done.
function openDialog(component: Component, props: Record<string, unknown>) {
  const host = document.createElement('div')
  document.body.append(host)

  const app = createApp(component, {
    ...props,
    onClose: () => {
      app.unmount()
      host.remove()
    },
  })
  app.mount(host)
}

export function openRenameDialog(props: Record<string, unknown>) {
  openDialog(RenameDialog, props)
}
