<script setup lang="ts">
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { fromDate } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { config } from '@/config'
import { cn } from '@/lib/utils'
import type { DateRange } from 'reka-ui'

defineProps<{
  disabled?: boolean
}>()

const startDate = defineModel<Date | undefined>('start-date', { required: true })
const endDate = defineModel<Date | undefined>('end-date', { required: true })

const df = new DateFormatter('pl-PL', {
  dateStyle: 'medium',
})


const value = computed<DateRange>({
  get() {
    return {
      start: fromDate(startDate.value ?? new Date(), config.timeZone),
      end: fromDate(endDate.value ?? new Date(), config.timeZone),
    }
  },
  set(value: DateRange) {
    startDate.value = value.start?.toDate(config.timeZone)
    endDate.value = value.end?.toDate(config.timeZone)
  },
})

</script>

<template>
  <div :class="cn('grid gap-2', $attrs.class ?? '')">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          id="date"
          :variant="'outline'"
          :disabled="disabled"
          :class="cn(
            'w-[300px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )"
        >
          <CalendarIcon class="mr-2 size-4" />

          <template v-if="value.start">
            <template v-if="value.end">
              {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{ df.format(value.end.toDate(getLocalTimeZone())) }}
            </template>

            <template v-else>
              {{ df.format(value.start.toDate(getLocalTimeZone())) }}
            </template>
          </template>
          <template v-else>
            Pick a date
          </template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="end">
        <RangeCalendar
          v-model="value"
          weekday-format="short"
          :number-of-months="2"
          initial-focus
          :placeholder="value.start"
          @update:start-value="(startDate) => value.start = startDate"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
