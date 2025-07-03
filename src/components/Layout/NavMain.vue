<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import type { MenuItem, MenuItemOrMenuCategory } from './menu.type'
import ComingSoonIcon from './Menu/ComingSoonIcon.vue'
import FeatureLockedIcon from './Menu/FeatureLockedIcon.vue'

const { t } = useI18n()

defineProps<{
  items: MenuItemOrMenuCategory[]
}>()

const route = useRoute()

const isGroupActive = (item: MenuItem) => {
  // return item.items?.some(child => route.path.startsWith(child.url)) ?? false
  return route.matched.some(record => item.items?.some(link => link.url.includes(record.path)))
}

const checkIsActive = (url: string) => {
  return url.length > 1 &&url.includes('/') && route.path.startsWith(url)
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>
      {{ t('common.menu.menu') }}
    </SidebarGroupLabel>
    <SidebarMenu>
      <template v-for="item in items" :key="item.title">
        <template v-if="item.isCategory">
          <SidebarMenuItem>
            <div class="px-3 py-2 text-xs font-medium text-sidebar-foreground/70">
              {{ item.title }}
            </div>
          </SidebarMenuItem>
        </template>
        <template v-else>
          <Collapsible
            v-if="item.items"
            as-child
            :default-open="isGroupActive(item)"
            class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton :tooltip="item.title">
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                  <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                    <RouterLink v-slot="{ href, isExactActive, navigate }" :to="subItem.url" custom>
                      <SidebarMenuSubButton
                        :is-active="isExactActive"
                        :href
                        :class="{ 'pointer-events-none opacity-50': subItem.locked }"
                        @click="navigate"
                      >
                        <span>{{ subItem.title }}</span>
                        <FeatureLockedIcon v-if="subItem.locked" class="ml-auto" />
                        <ComingSoonIcon v-if="subItem.soon" class="ml-auto" />
                      </SidebarMenuSubButton>
                    </RouterLink>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <SidebarMenuItem v-else>
            <RouterLink v-slot="{ href, isActive, isExactActive, navigate }" :to="item.url" custom>
              <SidebarMenuButton
                :is-active="isActive || isExactActive || checkIsActive(item.url)"
                :href
                as="a"
                :class="{ 'pointer-events-none opacity-50': item.locked }"
                @click="navigate"
              >
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
                <FeatureLockedIcon v-if="item.locked" class="ml-auto" />
                <ComingSoonIcon v-if="item.soon" class="ml-auto" />
              </SidebarMenuButton>
            </RouterLink>
          </SidebarMenuItem>
        </template>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>
