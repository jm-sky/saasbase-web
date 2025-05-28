<script setup lang="ts">
import { useForm } from 'vee-validate'
import Button from '@/components/ui/button/Button.vue'
import { FormField } from '@/components/ui/form'
import FormControl from '@/components/ui/form/FormControl.vue'
import FormDescription from '@/components/ui/form/FormDescription.vue'
import FormItem from '@/components/ui/form/FormItem.vue'
import FormLabel from '@/components/ui/form/FormLabel.vue'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import Input from '@/components/ui/input/Input.vue'
import { toast } from '@/components/ui/toast'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

defineProps<{
  tenant?: ITenant
}>()

const { handleSubmit } = useForm({
  initialValues: {
    color: '',
    currency: '',
    language: '',
    emailLanguage: '',
    invoiceLanguage: '',
  },
})

const submit = handleSubmit((values) => {
  toast.info('Not implemented', {
    description: JSON.stringify(values),
  })
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <h2 class="font-bold">
      Branding
    </h2>

    <form class="grid grid-cols-1 gap-4 mt-4" @submit.prevent="submit">
      <FormField v-slot="{ componentField }" name="language">
        <FormItem class="flex flex-row items-start gap-1">
          <FormLabel class="w-lg">
            Język domyślny
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="w-20" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="emailLanguage">
        <FormItem class="flex flex-row items-start gap-1">
          <FormLabel class="w-lg">
            Język wiadomości e-mail
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="w-20" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="invoiceLanguage">
        <FormItem class="flex flex-row items-start gap-1">
          <FormLabel class="w-lg">
            Język faktur
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="w-20" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="color">
        <FormItem class="flex flex-row items-start gap-1">
          <FormLabel class="w-lg">
            Color
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="w-20" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="logoImage">
        <FormItem class="flex flex-row items-start gap-1">
          <FormLabel class="w-lg">
            Obrazek logo
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="w-20" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="col-span-full">
        <Button type="submit" class="w-full">
          {{ $t('settings.save') }}
        </Button>
      </div>
    </form>
  </div>
</template>