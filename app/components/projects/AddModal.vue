<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const DEFAULT_DOMAIN_OPTIONS = ['firebase', 'adSense', 'adScore', 'fbq', 'ttq', 'bigo', 'webUrl']

const schema = z.object({
  project_name: z.string().min(2, 'Too short'),
  frontend_developer: z.string().optional(),
  backend_developer: z.string().optional(),
  domain_options: z.array(z.string()).optional(),
  ad_slot_options: z.array(z.string()).optional(),
  repo: z.string().optional(),
  remark: z.string().optional()
})

const emit = defineEmits(['refresh'])

const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  project_name: undefined,
  frontend_developer: undefined,
  backend_developer: undefined,
  domain_options: ['webTitle', 'webEmail', 'webLogo', 'aboutUs'],
  ad_slot_options: undefined,
  repo: undefined,
  remark: undefined
})

const toast = useToast()

/** 提交表单 */
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/api/project/add', {
      method: 'POST',
      body: state
    })
    toast.add({ title: 'Success', description: `New project ${event.data.project_name} added`, color: 'success' })
    // 重新获取项目列表
    emit('refresh')
  } catch (error: any) {
    console.error(error.data.message)
    toast.add({ title: 'Error', description: error.data.message, color: 'error' })
  }
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="新增项目"
    description="新增一个主题项目，如： 游戏模板 1"
    :ui="{
      content: 'max-w-xl'
    }"
  >
    <UButton label="新增项目" icon="i-uil-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="项目名称"
          required
          name="project_name"
        >
          <UInput v-model="state.project_name" placeholder="如：游戏模板 1" class="w-full" />
        </UFormField>
        <!-- 域名配置 -->
        <UFormField
          label="域名配置"
          name="domain_options"
        >
          <template #help>
            <p>每输入一个字段，点击回车确认；下方 7 个字段为域名通用字段，无需在此处添加</p>
            <div class="flex flex-wrap gap-1 mt-1">
              <UBadge
                v-for="option in DEFAULT_DOMAIN_OPTIONS"
                :key="option"
                color="neutral"
                variant="outline"
              >
                {{ option }}
              </UBadge>
            </div>
          </template>
          <UInputTags v-model="state.domain_options" class="w-full" />
        </UFormField>
        <!-- 广告位配置 -->
        <UFormField
          label="广告位配置"
          name="ad_slot_options"
          help="每输入一个广告位名称，点击回车确认"
        >
          <UInputTags v-model="state.ad_slot_options" class="w-full" />
        </UFormField>
        <UFormField
          label="仓库地址"
          name="repo"
        >
          <UInput v-model="state.repo" class="w-full" />
        </UFormField>
        <UFormField
          label="前端"
          name="frontend_developer"
        >
          <UInput v-model="state.frontend_developer" class="w-full" />
        </UFormField>
        <UFormField
          label="后端"
          name="backend_developer"
        >
          <UInput v-model="state.backend_developer" class="w-full" />
        </UFormField>
        <UFormField
          label="备注"
          name="remark"
        >
          <UInput v-model="state.remark" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
