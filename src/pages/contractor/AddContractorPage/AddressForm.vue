<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Input from '@/components/ui/input/Input.vue'
const { t } = useI18n()

defineProps<{
  isSubmitting: boolean
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-2 font-semibold mt-2 mb-2 border rounded-md p-4 bg-gray-50">
    <div class="col-span-full text-sm text-muted-foreground">
      {{ t('address.title') }}
    </div>
    <FormFieldLabeled
      v-slot="{ componentField }"
      name="address.city"
      :label="t('address.fields.city')"
      :disabled="isSubmitting"
      class="col-span-2"
    >
      <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
    </FormFieldLabeled>
    <FormFieldLabeled
      v-slot="{ componentField }"
      name="address.postalCode"
      :label="t('address.fields.postalCode')"
      :disabled="isSubmitting"
      class="col-span-2"
    >
      <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
    </FormFieldLabeled>
    <FormFieldLabeled
      v-slot="{ componentField }"
      name="address.street"
      :label="t('address.fields.street')"
      :disabled="isSubmitting"
      class="col-span-2"
    >
      <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
    </FormFieldLabeled>
    <FormFieldLabeled
      v-slot="{ componentField }"
      name="address.building"
      :label="t('address.fields.building')"
      :disabled="isSubmitting"
      class="col-span-2 md:col-span-1"
    >
      <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
    </FormFieldLabeled>
    <FormFieldLabeled
      v-slot="{ componentField }"
      name="address.flat"
      :label="t('address.fields.flat')"
      :disabled="isSubmitting"
      class="col-span-2 md:col-span-1"
    >
      <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
    </FormFieldLabeled>
  </div>
</template>