<script setup lang="ts">
import { editProject } from '~/api/projects'
import type { IProjectEdit } from '~/api/projects'
import ProjectForm from './ProjectForm.vue'

const { project } = defineProps<{
  project: IProjectEdit
}>()

const openModel = defineModel<boolean>('open', { required: true })
const emit = defineEmits(['refresh'])
const toast = useToast()

async function onEdit(data: IProjectEdit) {
  try {
    await editProject({ ...data, project_id: project.project_id })
    toast.add({ title: 'Success', description: `Project ${data.project_name} updated`, color: 'success' })
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
    title="编辑项目"
    description="编辑当前项目信息"
    :ui="{ content: 'max-w-xl' }"
  >
    <template #body>
      <ProjectForm :initial-data="project" @submit="onEdit" @cancel="onCancel" />
    </template>
  </UModal>
</template>
