<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/toast'
import SettingsHeader from '../partials/SettingsHeader.vue'

const notificationsFormSchema = toTypedSchema(z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    required_error: 'You need to select a notification type.',
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
}))

const { handleSubmit } = useForm({
  validationSchema: notificationsFormSchema,
  initialValues: {
    communication_emails: false,
    marketing_emails: false,
    social_emails: true,
    security_emails: true,
  },
})

const onSubmit = handleSubmit((values) => {
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
})
</script>

<template>
  <SettingsHeader
    title="Notifications"
    description="Configure how you receive notifications."
    work-in-progress
  />

  <Separator />

  <form
    class="space-y-8 opacity-50"
    @submit="onSubmit"
  >
    <FormField
      v-slot="{ componentField }"
      type="radio"
      name="type"
    >
      <FormItem class="space-y-3">
        <FormLabel>Notify me about...</FormLabel>
        <FormControl>
          <RadioGroup
            class="flex flex-col space-y-1"
            v-bind="componentField"
          >
            <FormItem class="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="all" />
              </FormControl>
              <FormLabel class="font-normal">
                All new messages
              </FormLabel>
            </FormItem>
            <FormItem class="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="mentions" />
              </FormControl>
              <FormLabel class="font-normal">
                Direct messages and mentions
              </FormLabel>
            </FormItem>
            <FormItem class="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="none" />
              </FormControl>
              <FormLabel class="font-normal">
                Nothing
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <SettingsHeader title="E-mail Notifications" description="Configure how you receive e-mail notifications." />

    <div class="space-y-4">
      <FormField
        v-slot="{ handleChange, value }"
        type="checkbox"
        name="communication_emails"
      >
        <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
          <div class="space-y-0.5">
            <FormLabel class="text-base">
              Communication emails
            </FormLabel>
            <FormDescription>
              Receive emails about your account activity.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              :model-value="value"
              disabled
              @update:model-value="handleChange"
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ handleChange, value }"
        type="checkbox"
        name="marketing_emails"
      >
        <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
          <div class="space-y-0.5">
            <FormLabel class="text-base">
              Marketing emails
            </FormLabel>
            <FormDescription>
              Receive emails about new products, features, and more.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              :model-value="value"
              disabled
              @update:model-value="handleChange"
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ handleChange, value }"
        type="checkbox"
        name="social_emails"
      >
        <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
          <div class="space-y-0.5">
            <FormLabel class="text-base">
              Social emails
            </FormLabel>
            <FormDescription>
              Receive emails for friend requests, follows, and more.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              :model-value="value"
              disabled
              @update:model-value="handleChange"
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ handleChange, value }"
        type="checkbox"
        name="security_emails"
      >
        <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
          <div class="space-y-0.5">
            <FormLabel class="text-base">
              Security emails
            </FormLabel>
            <FormDescription>
              Receive emails about your account activity and security.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              :model-value="value"
              disabled
              @update:model-value="handleChange"
            />
          </FormControl>
        </FormItem>
      </FormField>
    </div>

    <div class="flex justify-start">
      <Button type="submit" disabled>
        Update notifications
      </Button>
    </div>
  </form>
</template>
