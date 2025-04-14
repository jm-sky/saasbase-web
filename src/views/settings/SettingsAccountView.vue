<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { h, nextTick} from 'vue'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/domains/auth/store/auth.store'

const authStore = useAuthStore()

const accountFormSchema = toTypedSchema(z.object({
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
}))

const onSubmit = async (values: unknown) => {
  await nextTick()
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Account
    </h3>
    <p class="text-sm text-muted-foreground">
      Update your account settings. Set your preferred language and timezone.
    </p>
  </div>

  <Separator />

  <Form
    :validation-schema="accountFormSchema"
    :initial-values="{ ...authStore.userData }"
    class="space-y-8"
    @submit="onSubmit"
  >
    <FormField
      v-slot="{ componentField }"
      name="email"
    >
      <FormItem>
        <FormLabel>E-mail</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Your e-mail address"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          This is the e-mail used to login to application
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-start">
      <Button type="submit">
        Update account
      </Button>
    </div>
  </Form>
</template>
