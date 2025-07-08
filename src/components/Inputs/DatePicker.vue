<script setup lang="ts">
import { parseAbsolute } from '@internationalized/date'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-vue-next'
import { computed, type HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { ZonedDateTime } from '@internationalized/date'

const STANDARD_DATE_FORMAT = 'yyyy-MM-dd'

const modelValue = defineModel<string | undefined | null>('modelValue')

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const calendarValue = computed({
  get(): ZonedDateTime | undefined {
    const date = parseISO(modelValue.value ?? '')
    return modelValue.value ? parseAbsolute(date.toISOString(), 'UTC') : undefined
  },
  set(value: ZonedDateTime | undefined) {
    modelValue.value = value ? format(value.toDate(), STANDARD_DATE_FORMAT) : undefined
  }
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('w-36 justify-start text-left font-normal', props.class)"
      >
        <CalendarIcon class="mr-2 size-4" />
        {{ modelValue ?? 'xxxx-xx-xx' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="calendarValue" />
    </PopoverContent>
  </Popover>
</template>
