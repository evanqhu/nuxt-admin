<script setup lang="ts">
import { editAdsenseAccount } from '~/api/adsense'
import AdsenseForm from './AdsenseForm.vue'

const { adsenseAccount } = defineProps<{
  adsenseAccount: AdsenseItem
}>()

const openModel = defineModel<boolean>('open', { required: true })
const emit = defineEmits(['refresh'])
const toast = useToast()

async function onEdit(data: AdsenseItem) {
  try {
    await editAdsenseAccount({ ...data, account_id: adsenseAccount.account_id })
    toast.add({ title: 'Success', description: `Adsense account ${data.account_name} updated`, color: 'success' })
    emit('refresh')
  } catch (error: any) {
    console.error(error.data.message)
    toast.add({ title: 'Error', description: error.data.message, color: 'error' })
  }
  openModel.value = false
}

function onCancel() {
  openModel.value = false
}
</script>

<template>
  <UModal
    v-model:open="openModel"
    title="编辑 Adsense 账号"
    :ui="{ content: 'max-w-xl' }"
  >
    <template #body>
      <AdsenseForm :initial-data="adsenseAccount" @submit="onEdit" @cancel="onCancel" />
    </template>
  </UModal>
</template>
