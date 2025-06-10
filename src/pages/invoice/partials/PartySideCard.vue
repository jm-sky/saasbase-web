<script setup lang="ts">
import { MapPin, User } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex flex-col gap-y-2 rounded-lg border p-4">
    <div class="font-bold">
      {{ title }}
    </div>
    <div class="grid grid-cols-[4rem_1fr_1fr] gap-2">
      <Input variant="filled" placeholder="PL" />
      <Input variant="filled" placeholder="Name" />
      <Input variant="filled" placeholder="Tax ID" />

      <div class="flex items-center justify-center">
        <MapPin class="size-4" />
      </div>
      <Input variant="filled" placeholder="Address" />
      <Input variant="filled" placeholder="City" />

      <div class="flex items-center justify-center">
        <User class="size-4" />
      </div>
      <Input variant="filled" placeholder="Email" />
      <Input variant="filled" placeholder="Phone" />
    </div>
  </div>
</template>