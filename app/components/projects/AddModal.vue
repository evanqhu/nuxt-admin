<script setup lang="ts">
import { addProject } from '~/api/projects'
import type { IProjectAdd } from '~/api/projects'
import ProjectForm from './ProjectForm.vue'

const emit = defineEmits(['refresh'])
const open = ref(false)
const toast = useToast()

async function onAdd(data: IProjectAdd) {
  try {
    await addProject(data)
    toast.add({ title: 'Success', description: `New project ${data.project_name} added`, color: 'success' })
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
    title="新增项目"
    description="新增一个主题项目，如： 游戏模板 1"
    :ui="{ content: 'max-w-xl' }"
  >
    <UButton label="新增项目" icon="i-uil-plus" />
    <template #body>
      <ProjectForm @submit="onAdd" @cancel="onCancel" />
    </template>
  </UModal>
</template>
