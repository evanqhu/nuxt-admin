<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Row } from '@tanstack/table-core'
import { deleteFirebaseAccount } from '~/api/firebase'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const toast = useToast()

/** 表格实例 */
const table = useTemplateRef('table')

/** 列过滤 */
const columnFilters = ref([{
  id: 'account_name',
  value: ''
}])

const columnVisibility = ref() // 列可见性
const rowSelection = ref({}) // 行选择
const editModal = ref(false) // 编辑模态框
const selectedFirebaseAccount = ref<FirebaseItem>({} as FirebaseItem) // 选中的 Firebase 账号

/** 请求数据 */
const { data, status, error, refresh } = await useFetch<FirebaseItem[]>('/api/firebase/list', {
  lazy: true
})
if (error.value) {
  toast.add({ title: 'Error', description: error.value.data.message, color: 'error' })
}

/** 操作列项目 */
function getRowItems(row: Row<FirebaseItem>) {
  return [
    {
      type: 'label',
      label: '操作'
    },
    {
      label: '编辑 Firebase 账号',
      icon: 'i-uil-edit',
      onSelect() {
        editModal.value = true
        selectedFirebaseAccount.value = row.original
      }
    },
    {
      type: 'separator'
    },
    {
      label: '删除 Firebase 账号',
      icon: 'i-uil-trash',
      color: 'error',
      async onSelect() {
        await deleteFirebaseAccount(row.original.account_id)
        toast.add({
          title: 'Firebase account deleted',
          description: 'The Firebase account has been deleted.'
        })
        refresh()
      }
    }
  ]
}

/** 表格列 */
const columns: TableColumn<FirebaseItem>[] = [
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
  // Firebase 账号名称
  {
    accessorKey: 'account_name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Firebase 账号名称',
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
  // 账号信息
  {
    accessorKey: 'account_info',
    header: '账号信息',
    meta: {
      class: {
        th: 'min-w-[100px]'
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
  account_name: 'Firebase 账号名称',
  account_info: '账号信息',
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
  <UDashboardPanel id="firebase-accounts">
    <template #header>
      <UDashboardNavbar title="Firebase 账号">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <!-- 新增账号 -->
        <template #right>
          <FirebaseAddModal @refresh="refresh" />
          <FirebaseEditModal
            v-model:open="editModal"
            :firebase-account="selectedFirebaseAccount"
            @refresh="refresh"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <!-- 按 Firebase 账号名称搜索 -->
        <UInput
          :model-value="(table?.tableApi?.getColumn('account_name')?.getFilterValue() as string)"
          class="max-w-sm"
          icon="i-uil-search"
          placeholder="Filter Firebase account names..."
          @update:model-value="table?.tableApi?.getColumn('account_name')?.setFilterValue($event)"
        />

        <!-- 批量删除账号的按钮；显示/隐藏列 -->
        <div class="flex flex-wrap items-center gap-1.5">
          <FirebaseDeleteModal
            :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
            :ids="table?.tableApi?.getFilteredSelectedRowModel().rows.map(row => row.original.account_id)"
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
          </FirebaseDeleteModal>
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
