<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
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
import { projectStatusService } from '@/domains/project/services/ProjectStatusService'
import { cn } from '@/lib/utils'
import type { IProjectStatus } from '@/domains/project/types/project.type'

const { t } = useI18n()

const id = defineModel<string | undefined>('id', { required: true })

const { disabled, pickDefault } = defineProps<{
  disabled?: boolean
  popoverContentClass?: string
  /** When true and model empty, select the status marked isDefault (or first). */
  pickDefault?: boolean
}>()

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const statuses = ref<IProjectStatus[]>([])

const selected = computed(() => statuses.value.find((status) => status.id === id.value))

const loadStatuses = async () => {
  try {
    loading.value = true
    error.value = null
    statuses.value = await projectStatusService.index()
  } catch (err) {
    error.value = t('project.status.loadError', 'Failed to load project statuses')
    console.error('[ProjectStatusPicker][loadStatuses] error:', err)
  } finally {
    loading.value = false
  }
}

const applyDefault = () => {
  if (!pickDefault || id.value || statuses.value.length === 0) return
  const preferred = statuses.value.find((status) => status.isDefault) ?? statuses.value[0]
  id.value = preferred.id
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  id.value = event.detail.value as string
  open.value = false
}

onMounted(async () => {
  await loadStatuses()
  applyDefault()
})

watch(statuses, applyDefault)
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
        <span class="flex items-center gap-2 truncate">
          <span
            v-if="selected"
            class="size-2.5 shrink-0 rounded-full"
            :style="{ backgroundColor: selected.color }"
          />
          {{ selected?.name ?? t('project.status.select', 'Select status') }}
        </span>
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('project.status.search', 'Search status')" />
        <CommandList>
          <CommandEmpty>{{ error ?? t('project.status.notFound', 'No status found') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="status in statuses"
              :key="status.id"
              :value="status.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="id === status.id ? 'opacity-100' : 'opacity-0'"
              />
              <span
                class="mr-2 size-2.5 shrink-0 rounded-full"
                :style="{ backgroundColor: status.color }"
              />
              {{ status.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
