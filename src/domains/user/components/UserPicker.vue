<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { cn } from '@/lib/utils'
import type { IUserPreview } from '../types/user.type'
import { userService } from '../services/userService'

const { t } = useI18n()

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IUserPreview | undefined>('modelValue')

defineProps<{
  popoverContentClass?: string
  disabled?: boolean
}>()

const open = ref(false)
const loading = ref(false)
const users = ref<IUserPreview[]>([])

const loadUsers = async () => {
  try {
    loading.value = true
    users.value = await userService.index()
  } catch (err) {
    handleErrorWithToast(t('user.picker.loadError'), err)
    console.error('[UserPicker][loadUsers] error:', err)
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedVatRate = users.value.find((rate) => rate.id === selectedId)
  id.value = selectedVatRate?.id
  modelValue.value = selectedVatRate
  open.value = false
}

onMounted(() => {
  if (users.value.length === 0) {
    void loadUsers()
  }
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled || loading"
        class="w-full justify-between"
      >
        {{ modelValue?.name ?? t('user.picker.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('user.picker.search')" />
        <CommandList>
          <CommandEmpty>{{ t('user.picker.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="user in users"
              :key="user.id"
              :value="user.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.id === user.id ? 'opacity-100' : 'opacity-0'"
              />
              <Avatar class="size-7 mr-2">
                <AvatarImage :src="user.avatarUrl ?? ''" />
                <AvatarFallback>
                  {{ user.name.slice(0, 2) }}
                </AvatarFallback>
              </Avatar>
              {{ user.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
