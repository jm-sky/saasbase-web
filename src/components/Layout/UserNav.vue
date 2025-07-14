<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DropdownMenuItemLink from '@/components/ui/dropdown-menu/DropdownMenuItemLink.vue'
import { useLogout } from '@/domains/auth/composables/useLogout'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeTo } from '@/router/routeMap'
import { useLanguageStore } from '@/stores/language.store'
import Badge from '../ui/badge/Badge.vue'
import DropdownMenuSub from '../ui/dropdown-menu/DropdownMenuSub.vue'
import DropdownMenuSubContent from '../ui/dropdown-menu/DropdownMenuSubContent.vue'
import DropdownMenuSubTrigger from '../ui/dropdown-menu/DropdownMenuSubTrigger.vue'
import Switch from '../ui/switch/Switch.vue'
import type { TLocale } from '@/i18n'

const authStore = useAuthStore()
const { t } = useI18n()
const languageStore = useLanguageStore()

const { logout } = useLogout()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const { user } = storeToRefs(authStore)

const switchLanguage = (langCode: TLocale) => {
  languageStore.setLocale(langCode)
}
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
        <div class="flex flex-col gap-y-1">
          <p class="text-sm font-medium leading-none">
            {{ user?.fullName }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ user?.email }}
          </p>
          <p v-if="user?.roles?.length" class="mt-1 flex flex-row flex-wrap gap-1">
            <Badge v-for="role in user?.roles" :key="role" variant="outline">
              {{ role }}
            </Badge>
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItemLink :to="routeTo.settingsProfile()">
          {{ t('settings.profile.title') }}
        </DropdownMenuItemLink>
        <DropdownMenuItemLink :to="routeTo.settingsAccount()">
          {{ t('settings.account.title') }}
        </DropdownMenuItemLink>
        <DropdownMenuItemLink :to="routeTo.selectTenant()">
          {{ t('auth.selectTenant.title') }}
        </DropdownMenuItemLink>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem class="flex items-center justify-between">
        {{ t('layout.darkMode') }}
        <Switch :model-value="isDark" class="w-10 h-4" @click.stop.capture="toggleDark()" />
      </DropdownMenuItem>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {{ t('settings.preferences.appearance.language') }}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              v-for="locale in languageStore.availableLocales"
              :key="locale"
              :active="locale === languageStore.currentLocale"
              hoverable
              @click="switchLanguage(locale)"
            >
              <span>{{ t(`common.language.${locale}`) }}</span>
              <span class="ml-2 text-xs text-muted-foreground">({{ locale.toUpperCase() }})</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <DropdownMenuSeparator />

      <DropdownMenuItem class="bg-transparent!">
        <Button
          variant="outline"
          class="w-full"
          size="sm"
          @click="logout()"
        >
          {{ t('auth.signOut') }}
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
