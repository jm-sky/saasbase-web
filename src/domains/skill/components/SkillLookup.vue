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
import { cn } from '@/lib/utils'
import { skillService } from '../services/skillService'
import { type ISkill } from '@/domains/skill/models/skill.model'
  
const { t } = useI18n()

const modelValue = defineModel<string | undefined>('modelValue', { required: true })

defineProps<{
  popoverContentClass?: string
  disabled?: boolean
}>()

const open = ref(false)
const skills = ref<ISkill[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadSkills = async () => {
  try {
    loading.value = true
    error.value = null
    skills.value = await skillService.list()
  } catch (err) {
    error.value = 'Failed to load skills'
    console.error('[SkillLookup][loadSkills] error:', err)
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const id = event.detail.value
  modelValue.value = skills.value.find((skill) => skill.id === id)?.name ?? undefined
  open.value = false
}

watch(open, (newValue) => {
  if (newValue && skills.value.length === 0) {
    void loadSkills()
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
        {{ modelValue || t('skill.select') }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('skill.search')" />
        <CommandList>
          <CommandEmpty>{{ t('skill.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="skill in skills"
              :key="skill.id"
              :value="skill.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 h-4 w-4"
                :class="modelValue === skill.name ? 'opacity-100' : 'opacity-0'"
              />
              {{ skill.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
