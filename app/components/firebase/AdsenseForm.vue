<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const {
  initialData = {
    account_name: '',
    client_id: '',
    ads_txt: '',
    remark: undefined
  }
} = defineProps<{
  initialData?: IAdsenseAdd
}>()
const emit = defineEmits(['submit', 'cancel'])

const schema = z.object({
  account_name: z.string().min(2, 'Too short'),
  client_id: z.string(),
  ads_txt: z.string(),
  remark: z.string().optional()
})

const state = reactive<IAdsenseAdd>({
  account_name: '',
  client_id: '',
  ads_txt: '',
  remark: undefined
})

watchEffect(() => {
  Object.assign(state, initialData)
})

function onSubmit(event: FormSubmitEvent<IAdsenseAdd>) {
  emit('submit', state)
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Adsense 账号名称"
      name="account_name"
      required
    >
      <UInput v-model="state.account_name" placeholder="请输入 Adsense 账号名称" class="w-full" />
    </UFormField>
    <UFormField
      label="客户端 ID"
      name="client_id"
      required
    >
      <UInput v-model="state.client_id" class="w-full" />
    </UFormField>
    <UFormField
      label="ads.txt 内容"
      name="ads_txt"
      required
    >
      <UInput v-model="state.ads_txt" class="w-full" />
    </UFormField>
    <UFormField
      label="备注"
      name="remark"
    >
      <UInput v-model="state.remark" class="w-full" />
    </UFormField>
    <div class="flex justify-end gap-2">
      <UButton
        label="取消"
        color="neutral"
        variant="subtle"
        @click="emit('cancel')"
      />
      <UButton
        label="保存"
        color="primary"
        variant="solid"
        type="submit"
      />
    </div>
  </UForm>
</template>
