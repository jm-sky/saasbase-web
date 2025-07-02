<script setup lang="ts">
import { CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const modelValue = defineModel<string | undefined | null>('modelValue')

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
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
      <Calendar />
    </PopoverContent>
  </Popover>
</template>
