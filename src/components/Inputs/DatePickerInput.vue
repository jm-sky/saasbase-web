<script setup lang="ts">
import { parseAbsolute, type ZonedDateTime } from '@internationalized/date'
import { parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-vue-next'
import { computed, type HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Input from '../ui/input/Input.vue'

const modelValue = defineModel<string | undefined>('modelValue')

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const calendarValue = computed({
  get(): ZonedDateTime | undefined {
    const date = parseISO(modelValue.value ?? '')
    return modelValue.value ? parseAbsolute(date.toISOString(), 'UTC') : undefined
  },
  set(value: ZonedDateTime | undefined) {
    modelValue.value = value ? value.toString() : undefined
  }
})
</script>

<template>
  <Popover>
    <div class="relative" :class="props.class">
      <Input v-model="modelValue" />
      <PopoverTrigger as-child>
        <Button variant="ghost" size="icon" class="absolute right-0 top-0 hover:bg-transparent hover:text-primary">
          <CalendarIcon class="size-4" />
        </Button>
      </PopoverTrigger>
    </div>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="calendarValue" />
    </PopoverContent>
  </Popover>
</template>
