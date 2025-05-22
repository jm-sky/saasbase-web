<script setup lang="ts">
import DarkModeButton from '@/components/DarkModeButton.vue'
import LanguageSwitchDropdown from '@/components/LanguageSwitchDropdown.vue'
import AppSidebar from '@/components/Layout/AppSidebar.vue'
import NotificationsDrawer from '@/components/Layout/Notifications/NotificationsDrawer.vue'
import Search from '@/components/Layout/Search.vue'
import UserNav from '@/components/Layout/UserNav.vue'
import ThemeColorButton from '@/components/LayoutConfigurator/ThemeColorButton.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { config } from '@/config'
import UserAuthModal from '@/domains/auth/components/UserAuthModal.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import FloatingAiChatWidget from '@/domains/chat/components/FloatingAiChatWidget.vue'
import FloatingChatWidget from '@/domains/chat/components/FloatingChatWidget.vue'
import SelectTenantModal from '@/domains/tenant/components/SelectTenantModal.vue'
import TopbarNav from '@/layouts/partials/TopbarNav.vue'

const authStore = useAuthStore()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="bg-sidebar">
      <header class="px-4 flex h-16 shrink-0 items-center gap-2 bg-sidebar transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <SidebarTrigger class="-ml-1" />
        <Separator
          orientation="vertical"
          class="w-full data-[orientation=vertical]:h-4"
        />
        <TopbarNav class="hidden md:block mx-6" />
        <div class="ml-auto flex items-center gap-2">
          <Search disabled />
          <DarkModeButton variant="ghost-primary" class="rounded-full hidden md:inline-flex" />
          <ThemeColorButton variant="ghost-primary" class="rounded-full hidden md:inline-flex" />
          <LanguageSwitchDropdown variant="ghost-primary" class="rounded-full hidden md:inline-flex" />
          <NotificationsDrawer />
          <UserNav />
        </div>
      </header>
      <nav v-if="$slots.breadcrumbs" class="px-4 flex h-6 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink to="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <slot name="breadcrumbs" />
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <ScrollArea class="flex flex-col h-full max-w-[100vw] md:h-[var(--content-height)] pr-1 md:mr-4 md:mb-2 bg-background border rounded-xl grow">
        <slot />
      </ScrollArea>
    </SidebarInset>

    <UserAuthModal v-if="authStore.showAuthModal" />
    <SelectTenantModal v-if="authStore.showSelectTenantModal" />
    <FloatingAiChatWidget v-if="config.aiChat.enabled" />
    <FloatingChatWidget v-if="config.chat.enabled && !config.aiChat.enabled" />
  </SidebarProvider>
</template>
