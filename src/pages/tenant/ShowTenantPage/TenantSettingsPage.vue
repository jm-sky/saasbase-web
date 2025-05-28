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
import Switch from '@/components/ui/switch/Switch.vue'
import { toast } from '@/components/ui/toast'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

defineProps<{
  tenant?: ITenant
}>()

const { handleSubmit, values } = useForm({
  initialValues: {
    require2fa: false,
    currency: '',
    contractors: {
      fetchLogo: false,
    },
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
      Settings
    </h2>

    <form class="grid grid-cols-1 gap-4 mt-4" @submit.prevent="submit">
      <FormField v-slot="{ componentField }" name="currency">
        <FormItem class="flex flex-row items-start gap-1">
          <FormLabel class="w-lg">
            Currency
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="w-20" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="require2fa">
        <FormItem class="flex flex-row items-start gap-1">
          <FormLabel class="w-lg">
            Require users to use 2FA
          </FormLabel>
          <FormControl>
            <Switch v-bind="componentField" :checked="values?.require2fa" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="contractors.fetchLogo">
        <FormItem class="flex flex-row items-start gap-1">
          <FormLabel class="w-lg">
            Try fetch logo for new contracts
          </FormLabel>
          <FormControl>
            <Switch v-bind="componentField" />
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