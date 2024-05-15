<script lang="ts" setup>
import { ChevronLeft } from 'lucide-vue-next';
import { CalendarPrev, type CalendarPrevProps, useForwardProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = defineProps<CalendarPrevProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props; // eslint-disable-line @typescript-eslint/no-unused-vars

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <CalendarPrev
    :class="cn(
      buttonVariants({ variant: 'outline' }),
      'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot>
      <ChevronLeft class="size-4" />
    </slot>
  </CalendarPrev>
</template>
