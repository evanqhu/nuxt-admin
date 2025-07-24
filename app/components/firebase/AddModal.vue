<script setup lang="ts">
import { addAdsenseAccount } from '~/api/adsense'
import AdsenseForm from './AdsenseForm.vue'

const emit = defineEmits(['refresh'])
const open = ref(false)
const toast = useToast()

async function onAdd(data: IAdsenseAdd) {
  try {
    await addAdsenseAccount(data)
    toast.add({ title: 'Success', description: `New adsense account ${data.account_name} added`, color: 'success' })
    emit('refresh')
  } catch (error: any) {
    console.error(error.data.message)
    toast.add({ title: 'Error', description: error.data.message, color: 'error' })
  }
  open.value = false
}

function onCancel() {
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="新增 Adsense 账号"
    :ui="{ content: 'max-w-xl' }"
  >
    <UButton label="新增 Adsense 账号" icon="i-uil-plus" />
    <template #body>
      <AdsenseForm @submit="onAdd" @cancel="onCancel" />
    </template>
  </UModal>
</template>
