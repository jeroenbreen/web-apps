<!--
  SPDX-FileCopyrightText: 2026 Euro-Office contributors
  SPDX-License-Identifier: AGPL-3.0-only
-->
<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import EoDialog from '../components/EoDialog.vue'

type Result = 'ok' | 'cancel'

const props = defineProps<{
  filename: string
  maxLength?: number
  labels: { name: string; invalidName: string; ok: string; cancel: string }
  onResult?: (result: Result, value: string) => void
}>()
const emit = defineEmits<{ close: [] }>()

const lastDot = props.filename.lastIndexOf('.')
const name = ref(lastDot > 0 ? props.filename.substring(0, lastDot) : props.filename)
const showError = ref(false)
const input = useTemplateRef('input')

const isValid = computed(() => !/[\t*+:"<>?|\\/]/.test(name.value))

function selectName() {
  input.value?.focus()
  input.value?.select()
}

function finish(result: Result) {
  if (result === 'ok' && !isValid.value) {
    showError.value = true
    input.value?.focus()
    return
  }
  props.onResult?.(result, name.value)
  emit('close')
}
</script>

<template>
  <EoDialog
    :width="330"
    :label="labels.name"
    @opened="selectName"
    @escape="emit('close')"
  >
    <form @submit.prevent="finish('ok')">
      <div class="box">
        <div class="input-row">
          <label for="eo-rename-name">{{ labels.name }}</label>
        </div>
        <div class="input-row">
          <div class="input-field" :class="{ error: showError && !isValid }" style="width: 100%">
            <input
              id="eo-rename-name"
              ref="input"
              v-model="name"
              class="form-control"
              type="text"
              spellcheck="false"
              :maxlength="maxLength"
              :aria-invalid="showError && !isValid"
            >
            <span class="input-error" :title="labels.invalidName" />
          </div>
        </div>
      </div>
      <div class="footer center">
        <button class="btn normal dlg-btn primary" type="submit">{{ labels.ok }}</button>
        <button class="btn normal dlg-btn" type="button" @click="finish('cancel')">{{ labels.cancel }}</button>
      </div>
    </form>
  </EoDialog>
</template>
