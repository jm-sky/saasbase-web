<script lang="ts" setup generic="T extends object">
import { computed } from 'vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface IOption<T> {
  value: string
  label: string
  data: T
}

const props = defineProps<{
  options: IOption<T>[]
  isCollapsed?: boolean
}>()

const modelValue = defineModel<IOption<T> | undefined>()

const selectedValue = computed({
  get() {
    return modelValue.value?.value
  },
  set(value: string) {
    modelValue.value = props.options.find(item => item.value === value)
  },
})

const selectedLabel = computed(() => modelValue.value?.label)
</script>

<template>
  <Select v-model="selectedValue">
    <SelectTrigger
      aria-label="Select account"
      :class="cn(
        'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
        { 'flex size-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden': isCollapsed },
      )"
    >
      <SelectValue placeholder="Select an account">
        <div class="flex items-center gap-3">
          {{ selectedLabel }}
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="option of options"
        :key="option.value"
        :value="option.value"
      >
        <slot name="option" :option="option">
          <div class="flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
            {{ option.label }}
          </div>
        </slot>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
