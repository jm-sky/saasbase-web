<script setup lang="ts">
import {
  Building2,
  DollarSign,
  FileText,
  Mail,
  MailCheck,
  Newspaper,
  Package,
  Rocket,
  Settings2,
  Tag,
  Users,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NavMain from '@/components/Layout/NavMain.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import TenantBrandInfo from '@/domains/tenant/components/branding/TenantBrandInfo.vue'
import UIIcon from '../UIIcon.vue'
import type { MenuItemOrMenuCategory } from './menu.type'
import type { SidebarProps } from '@/components/ui/sidebar'

const { t } = useI18n()
const authStore = useAuthStore()

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const menu = computed<MenuItemOrMenuCategory[]>(() => {
  const items: MenuItemOrMenuCategory[] = [
    {
      title: t('dashboard.title'),
      url: '/',
      icon: Rocket,
    },
    {
      title: t('feed.title'),
      url: '/feeds',
      icon: Newspaper,
    },
    {
      title: t('common.menu.financial'),
      isCategory: true,
    },
    {
      title: t('contractor.title'),
      url: '/contractors',
      icon: Users,
    },
    {
      title: t('product.title'),
      url: '/products',
      icon: Package,
    },
    {
      title: t('expense.title'),
      url: '/expenses',
      icon: FileText,
    },
    {
      title: t('invoice.title'),
      url: '/invoices',
      icon: DollarSign,
    },
    {
      title: t('common.menu.other'),
      isCategory: true,
    },
    {
      title: t('project.title'),
      url: '#',
      icon: Tag,
      items: [
        {
          title: t('project.list.title'),
          url: '/projects',
        },
        {
          title: t('project.board.title'),
          url: '/projects-board',
        },
      ],
    },
    {
      title: t('common.menu.communication'),
      isCategory: true,
    },
    {
      title: t('common.menu.mailbox'),
      url: '/mailbox/inbox',
      icon: Mail,
      soon: true,
    },
    {
      title: t('common.menu.edoreczenia'),
      url: '/e-doreczenia',
      icon: MailCheck,
      locked: true,
    },
    {
      title: t('chat.title'),
      url: '/chat',
      icon: Mail,
    },
  ]

  if (authStore.tenantId) {
    items.push({
      title: t('tenant.menuCategories.tenantSettings'),
      isCategory: true,
    })
    items.push({
      title: t('tenant.menuCategories.companySettings'),
      icon: Building2,
      url: `/tenants/${authStore.tenantId}/show`,
    })
    items.push({
      title: t('tenant.menuCategories.financialSettings'),
      icon: DollarSign,
      url: `/tenants/${authStore.tenantId}/financial-settings`,
    })
    items.push({
      title: t('tenant.menuCategories.usersSettings'),
      icon: Users,
      url: `/tenants/${authStore.tenantId}/user-settings`,
    })
  }

  items.push({
    title: t('settings.category'),
    isCategory: true,
  })

  items.push({
    title: t('common.settings'),
    url: '#',
    icon: Settings2,
    items: [
      {
        title: t('settings.profile.title'),
        url: '/settings/profile',
      },
      {
        title: t('settings.account.title'),
        url: '/settings/account',
      },
      {
        title: t('settings.preferences.appearance.title'),
        url: '/settings/appearance',
      },
    ],
  })

  return items
})
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <RouterLink
        to="/"
        class="h-14 flex flex-row gap-2 justify-center items-center px-2 hover:text-primary transition-colors group-has-data-[collapsible=icon]/sidebar-wrapper:h-10 group-has-data-[collapsible=icon]/sidebar-wrapper:px-0"
      >
        <UIIcon
          icon="lucide:rocket"
          class="text-3xl text-primary"
        />
        <div class="font-bold text-lg group-has-data-[collapsible=icon]/sidebar-wrapper:hidden bg-gradient-to-r from-primary-900 to-primary-500 bg-clip-text text-transparent">
          {{ config.appName }}
        </div>
      </RouterLink>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="menu" />
    </SidebarContent>
    <SidebarFooter class="p-4">
      <TenantBrandInfo />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
