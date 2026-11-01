<!--
  SPDX-FileCopyrightText: 2026 Euro-Office contributors
  SPDX-License-Identifier: AGPL-3.0-only
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'reka-ui'

defineProps<{ width: number; label: string }>()
const emit = defineEmits<{ opened: []; escape: [] }>()

declare const Common: {
  NotificationCenter: { trigger(event: string, ...args: unknown[]): void }
}

// controller/Main.js only lowers its modal count for a dialog that is visible
// when it closes. Having no cid keeps FocusManager out, Reka handles focus here.
const backboneDialog = { isVisible: () => true }

onMounted(() => Common.NotificationCenter.trigger('modal:show', backboneDialog))
onBeforeUnmount(() => {
  const last = !document.querySelector('.asc-window.modal:not(.eo-dialog)')
  Common.NotificationCenter.trigger('modal:close', backboneDialog, last)
})
</script>

<template>
  <DialogRoot :open="true" :modal="true">
    <DialogPortal>
      <DialogOverlay class="eo-dialog-mask" />
      <!-- Escape is handled here: Reka listens on window, and in the editor the key doesn't get that far. -->
      <DialogContent
        class="eo-dialog asc-window modal modal-dlg"
        :style="{ width: `${width}px` }"
        :aria-label="label"
        :aria-describedby="undefined"
        @open-auto-focus.prevent="emit('opened')"
        @close-auto-focus.prevent
        @keydown.esc.stop.prevent="emit('escape')"
        @escape-key-down.prevent
        @interact-outside.prevent
      >
        <div class="body">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
