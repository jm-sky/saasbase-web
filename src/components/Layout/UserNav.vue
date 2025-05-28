<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DropdownMenuItemLink from '@/components/ui/dropdown-menu/DropdownMenuItemLink.vue'
import { useLogout } from '@/domains/auth/composables/useLogout'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeTo } from '@/router/routeMap'
import Switch from '../ui/switch/Switch.vue'

const authStore = useAuthStore()

const { logout } = useLogout()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const { user } = storeToRefs(authStore)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative size-8 rounded-full">
        <Avatar class="size-8 border">
          <AvatarImage :src="user?.avatarUrl ?? ''" :alt="user?.fullName" />
          <AvatarFallback>{{ user?.initials }}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ user?.fullName }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ user?.email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItemLink :to="routeTo.settingsProfile()">
          Profile
        </DropdownMenuItemLink>
        <DropdownMenuItemLink :to="routeTo.settingsAccount()">
          Settings
        </DropdownMenuItemLink>
        <DropdownMenuItemLink :to="routeTo.selectTenant()">
          Change Tenant
        </DropdownMenuItemLink>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem class="flex items-center justify-between">
        Dark Mode
        <Switch v-model:checked="isDark" class="w-10 h-4" @click.stop.capture="toggleDark()" />
      </DropdownMenuItem>

      <DropdownMenuItem class="flex items-center justify-between">
        Language
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem>
        <Button
          variant="outline"
          class="w-full"
          size="sm"
          @click="logout()"
        >
          {{ $t('auth.signOut') }}
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
