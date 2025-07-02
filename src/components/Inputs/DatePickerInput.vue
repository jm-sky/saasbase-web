<script setup lang="ts">
import { CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Input from '../ui/input/Input.vue'
import type { HTMLAttributes } from 'vue'

const modelValue = defineModel<string | undefined>('modelValue')

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Popover>
    <div class="relative">
      <Input v-model="modelValue" :class="props.class" />
      <PopoverTrigger as-child>
        <Button variant="outline" class="w-36 justify-start text-left font-normal">
          <CalendarIcon class="mr-2 size-4" />
          {{ modelValue ?? 'xxxx-xx-xx' }}
        </Button>
      </PopoverTrigger>
    </div>
    <PopoverContent class="w-auto p-0">
      <Calendar />
    </PopoverContent>
  </Popover>
</template>
