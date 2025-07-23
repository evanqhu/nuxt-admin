<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// const toast = useToast()

const open = ref(false)

const links = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Projects',
    icon: 'i-uil-folder',
    to: '/projects',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Adsense Accounts',
    icon: 'i-hugeicons-advertisement',
    to: '/adsense-accounts',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Customers',
    icon: 'i-lucide-users',
    to: '/customers',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: 'i-lucide-settings',
    defaultOpen: true,
    type: 'trigger',
    children: [
      {
        label: 'General',
        to: '/settings',
        exact: true,
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: 'Members',
        to: '/settings/members',
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: 'Notifications',
        to: '/settings/notifications',
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: 'Security',
        to: '/settings/security',
        onSelect: () => {
          open.value = false
        }
      }
    ]
  }
] satisfies NavigationMenuItem[]

// onMounted(async () => {
//   const cookie = useCookie('cookie-consent')
//   if (cookie.value === 'accepted') {
//     return
//   }

//   toast.add({
//     title: 'We use first-party cookies to enhance your experience on our website.',
//     duration: 0,
//     close: false,
//     actions: [{
//       label: 'Accept',
//       color: 'neutral',
//       variant: 'outline',
//       onClick: () => {
//         cookie.value = 'accepted'
//       }
//     }, {
//       label: 'Opt out',
//       color: 'neutral',
//       variant: 'ghost'
//     }]
//   })
// })
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <UButton
          icon="i-uil-rocket"
          to="/"
          :trailing-icon="collapsed ? undefined : 'i-uil-angle-right-b'"
          label="Synjoy Admin"
          color="neutral"
          variant="ghost"
          block
          :square="collapsed"
          class="data-[state=open]:bg-elevated"
          :class="[!collapsed && 'py-2']"
          :ui="{
            leadingIcon: 'text-primary',
            trailingIcon: 'text-dimmed',
            label: 'text-lg font-bold text-primary'
          }"
        />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>
