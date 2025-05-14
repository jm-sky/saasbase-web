<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
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
import type { MenuItem } from './menu.type'

defineProps<{
  items: MenuItem[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Menu</SidebarGroupLabel>
    <SidebarMenu>
      <template v-for="item in items" :key="item.title">
        <Collapsible
          v-if="item.items"
          as-child
          :default-open="item.isActive"
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
                      @click="navigate"
                    >
                      <span>{{ subItem.title }}</span>
                    </SidebarMenuSubButton>
                  </RouterLink>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        <SidebarMenuItem v-else>
          <RouterLink v-slot="{ href, isExactActive, navigate }" :to="item.url" custom>
            <SidebarMenuButton
              :is-active="isExactActive"
              :href
              @click="navigate"
            >
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </SidebarMenuButton>
          </RouterLink>
        </SidebarMenuItem>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>
