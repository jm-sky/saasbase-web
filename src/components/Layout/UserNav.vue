<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
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
import { routeTo } from '@/router/routeMap'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const { user } = storeToRefs(authStore)

const logout = async () => {
  await authService.logout()
  await router.push('/login')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative size-8 rounded-full">
        <Avatar class="size-8">
          <AvatarImage :src="user?.image ?? ''" :alt="user?.fullName" />
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
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer" @click="logout()">
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
