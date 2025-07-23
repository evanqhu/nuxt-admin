<script setup lang="ts">
import { deleteProject } from '~/api/projects'

const { count = 0, ids = [] } = defineProps<{
  count?: number
  ids?: number[]
}>()

const open = ref(false)
const emit = defineEmits(['refresh'])
const toast = useToast()

async function onSubmit() {
  const res = await deleteProject(ids)
  if (res.code === 0) {
    toast.add({ title: 'Success', description: `Deleted ${count} project${count > 1 ? 's' : ''}`, color: 'success' })
    emit('refresh')
  }
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${count} project${count > 1 ? 's' : ''}`"
    :description="`Are you sure, this action cannot be undone.`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
