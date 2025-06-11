<script setup lang="ts">
import {
  Building2,
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
import type { MenuItem } from './menu.type'
import type { SidebarProps } from '@/components/ui/sidebar'

const { t } = useI18n()
const authStore = useAuthStore()

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const menu = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
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
      title: t('invoice.title'),
      url: '/invoices',
      icon: FileText,
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
      title: 'Mailbox',
      url: '/mailbox/inbox',
      icon: Mail,
      soon: true,
    },
    {
      title: 'E-Doręczalnia',
      url: '/e-doreczenia',
      icon: MailCheck,
      locked: true,
    },
    {
      title: 'Chat',
      url: '/chat',
      icon: Mail,
    },
  ]

  if (authStore.tenantId) {
    items.push({
      title: 'Tenant',
      icon: Building2,
      url: `/tenants/${authStore.tenantId}/show/overview`,
    })
  }

  items.push({
    title: 'Settings',
    url: '#',
    icon: Settings2,
    items: [
      {
        title: 'Profile',
        url: '/settings/profile',
      },
      {
        title: 'Account',
        url: '/settings/account',
      },
      {
        title: 'Appearance',
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
      <RouterLink to="/" class="h-14 flex flex-row gap-4 justify-center items-center px-2 hover:text-primary transition-colors group-has-data-[collapsible=icon]/sidebar-wrapper:h-10 group-has-data-[collapsible=icon]/sidebar-wrapper:px-0">
        <i class="fa-solid fa-rocket group-has-data-[state=expanded]/sidebar-wrapper:scale-200" />
        <div class="font-bold text-lg group-has-data-[collapsible=icon]/sidebar-wrapper:hidden">
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
