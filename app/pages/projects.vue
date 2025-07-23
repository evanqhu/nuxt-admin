<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Project } from '~/types'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UCheckbox = resolveComponent('UCheckbox')
const ULink = resolveComponent('ULink')
const toast = useToast()

const table = useTemplateRef('table')

const columnFilters = ref([{
  id: 'project_name',
  value: ''
}])

const columnVisibility = ref()
const rowSelection = ref({})

const { data, status, error, refresh } = await useFetch<Project[]>('/api/project/list', {
  lazy: true
})
if (error.value) {
  toast.add({ title: 'Error', description: error.value.data.message, color: 'error' })
}

/** 表格列 */
const columns: TableColumn<Project>[] = [
  // 选择列
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row'
      })
  },
  // 项目名称
  {
    accessorKey: 'project_name',
    header: '项目名称',
    meta: {
      class: {
        th: 'min-w-[100px]'
      }
    }
  },
  // 域名配置
  {
    accessorKey: 'domain_options',
    header: '域名配置',
    cell: ({ row }) => {
      const options = row.original.domain_options || []
      return h('div', { class: 'flex gap-1 flex-wrap' }, options.map(opt =>
        h(UBadge, { variant: 'subtle', color: 'primary' }, () => opt)
      ))
    },
    meta: {
      class: {
        th: 'min-w-[100px]'
      }
    }
  },
  // 广告位
  {
    accessorKey: 'ad_slot_options',
    header: '广告位配置',
    cell: ({ row }) => {
      // 兼容空值
      const options = row.original.ad_slot_options || []
      return h('div', { class: 'flex gap-1 flex-wrap' }, options.map(opt =>
        h(UBadge, { variant: 'subtle', color: 'secondary' }, () => opt)
      ))
    }
  },
  // 仓库地址
  {
    accessorKey: 'repo',
    header: '仓库地址',
    cell: ({ row }) => {
      // 只显示最后一个 / 后面的内容
      const repoUrl = row.original.repo || ''
      const displayText = repoUrl.substring(repoUrl.lastIndexOf('/') + 1)
      return h(ULink, {
        to: repoUrl,
        target: '_blank',
        class: 'underline font-bold'
      }, () => displayText)
    }
  },
  // 前端开发负责人
  {
    accessorKey: 'frontend_developer',
    header: '前端'
  },
  // 后端开发负责人
  {
    accessorKey: 'backend_developer',
    header: '后端'
  },
  // 备注
  {
    accessorKey: 'remark',
    header: '备注',
    meta: {
      class: {
        th: 'min-w-[100px]'
      }
    }
  }
]

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})
</script>

<template>
  <UDashboardPanel id="projects">
    <template #header>
      <UDashboardNavbar title="Projects">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <!-- 新增项目 -->
        <template #right>
          <ProjectsAddModal @refresh="refresh" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <!-- 按项目名称搜索 -->
        <UInput
          :model-value="(table?.tableApi?.getColumn('project_name')?.getFilterValue() as string)"
          class="max-w-sm"
          icon="i-uil-search"
          placeholder="Filter project names..."
          @update:model-value="table?.tableApi?.getColumn('project_name')?.setFilterValue($event)"
        />

        <!-- 批量删除项目的按钮 -->
        <div class="flex flex-wrap items-center gap-1.5">
          <CustomersDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              label="Delete"
              color="error"
              variant="subtle"
              icon="i-uil-trash"
            >
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </CustomersDeleteModal>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default'
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
