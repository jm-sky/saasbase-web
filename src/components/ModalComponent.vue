<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const { size = 'md' } = defineProps<{
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()

const isOpen = defineModel<boolean>('open', { default: true })

const variants = {
  size: {
    sm: 'sm:max-w-[425px]',
    md: 'sm:max-w-[500px]',
    lg: 'sm:max-w-[600px]',
    xl: 'sm:max-w-[800px]'
  }
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogContent :class="variants.size[size]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <slot />
      </div>

      <DialogFooter v-if="$slots.footer">
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>