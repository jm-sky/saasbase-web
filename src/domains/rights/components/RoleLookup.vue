<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
import { type IRole, roleService } from '../services/roleService'

const { t } = useI18n()

const modelValue = defineModel<string | undefined>('modelValue', { required: true })

defineProps<{
  disabled?: boolean
}>()

const open = ref(false)
const roles = ref<IRole[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadRoles = async () => {
  try {
    loading.value = true
    error.value = null
    roles.value = await roleService.list()
  } catch (err) {
    error.value = 'Failed to load roles'
    console.error('[RoleLookup][loadRoles] error:', err)
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const id = event.detail.value
  modelValue.value = roles.value.find((role) => role.id === id)?.name ?? undefined
  open.value = false
}

watch(open, (newValue) => {
  if (newValue && roles.value.length === 0) {
    void loadRoles()
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
        {{ modelValue || t('role.select') }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0">
      <Command>
        <CommandInput :placeholder="t('role.search')" />
        <CommandList>
          <CommandEmpty>{{ t('role.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="role in roles"
              :key="role.id"
              :value="role.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 h-4 w-4"
                :class="modelValue === role.name ? 'opacity-100' : 'opacity-0'"
              />
              {{ role.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
