<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Row } from '@tanstack/table-core'
import { deleteProject } from '~/api/projects'
import type { Project } from '~/types'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const ULink = resolveComponent('ULink')
const toast = useToast()

/** 表格实例 */
const table = useTemplateRef('table')

/** 列过滤 */
const columnFilters = ref([{
  id: 'project_name',
  value: ''
}])

const columnVisibility = ref() // 列可见性
const rowSelection = ref({}) // 行选择
const editModal = ref(false) // 编辑模态框
const selectedProject = ref<Project>({} as Project) // 选中的项目

/** 请求数据 */
const { data, status, error, refresh } = await useFetch<Project[]>('/api/project/list', {
  lazy: true
})
if (error.value) {
  toast.add({ title: 'Error', description: error.value.data.message, color: 'error' })
}

/** 操作列项目 */
function getRowItems(row: Row<Project>) {
  return [
    {
      type: 'label',
      label: '操作'
    },
    {
      label: '编辑项目',
      icon: 'i-uil-edit',
      onSelect() {
        editModal.value = true
        selectedProject.value = row.original
      }
    },
    {
      type: 'separator'
    },
    {
      label: '删除项目',
      icon: 'i-uil-trash',
      color: 'error',
      async onSelect() {
        await deleteProject(row.original.project_id)
        toast.add({
          title: 'Project deleted',
          description: 'The project has been deleted.'
        })
        refresh()
      }
    }
  ]
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
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: '项目名称',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
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
    },
    meta: {
      class: {
        th: 'min-w-[120px]'
      }
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
    },
    meta: {
      class: {
        th: 'min-w-[100px]'
      }
    }
  },
  // 前端开发负责人
  {
    accessorKey: 'frontend_developer',
    header: '前端',
    meta: {
      class: {
        th: 'min-w-[70px]'
      }
    }
  },
  // 后端开发负责人
  {
    accessorKey: 'backend_developer',
    header: '后端',
    meta: {
      class: {
        th: 'min-w-[70px]'
      }
    }
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
  },
  // 操作
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]

/** 列名称映射 */
const COLUMNS_MAP = {
  select: '选择',
  project_name: '项目名称',
  domain_options: '域名配置',
  ad_slot_options: '广告位配置',
  repo: '仓库地址',
  frontend_developer: '前端',
  backend_developer: '后端',
  remark: '备注',
  actions: '操作'
}

/** 分页 */
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
          <ProjectsEditModal
            v-model:open="editModal"
            :project="selectedProject"
            @refresh="refresh"
          />
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

        <!-- 批量删除项目的按钮；显示/隐藏列 -->
        <div class="flex flex-wrap items-center gap-1.5">
          <ProjectsDeleteModal
            :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
            :ids="table?.tableApi?.getFilteredSelectedRowModel().rows.map(row => row.original.project_id)"
            @refresh="refresh"
          >
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
          </ProjectsDeleteModal>
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => ({
                  label: COLUMNS_MAP[column.id as keyof typeof COLUMNS_MAP],
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="展示列"
              color="neutral"
              variant="outline"
              trailing-icon="i-uil-setting"
            />
          </UDropdownMenu>
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
