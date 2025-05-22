<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useThemeStore } from '@/stores/theme.store'
import SettingsHeader from './partials/SettingsHeader.vue'

const theme = useThemeStore()

const appearanceFormSchema = toTypedSchema(z.object({
  theme: z.enum(['light', 'dark'], {
    required_error: 'Please select a theme.',
  }),
}))

const { handleSubmit } = useForm({
  validationSchema: appearanceFormSchema,
  initialValues: {
    theme: 'light',
  },
})

const onSubmit = handleSubmit((values) => {
  theme.toggleDark(values.theme === 'dark')
})
</script>

<template>
  <SettingsHeader title="Appearance" description="Customize the appearance of the app. Automatically switch between day and night themes." />

  <Separator />

  <form
    class="space-y-8"
    @submit="onSubmit"
  >
    <FormField
      v-slot="{ componentField }"
      type="radio"
      name="theme"
    >
      <FormItem class="space-y-1">
        <FormLabel>Theme</FormLabel>
        <FormDescription>
          Select the theme for the dashboard.
        </FormDescription>
        <FormMessage />

        <RadioGroup
          class="grid max-w-md grid-cols-2 gap-8 pt-2"
          v-bind="componentField"
        >
          <FormItem>
            <FormLabel class="[&:has([data-state=checked])>div]:border-primary">
              <FormControl>
                <RadioGroupItem
                  value="light"
                  class="sr-only"
                />
              </FormControl>
              <div class="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                <div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div class="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div class="h-2 w-20 rounded-lg bg-[#ecedef]" />
                    <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                </div>
              </div>
              <span class="block w-full p-2 text-center font-normal">
                Light
              </span>
            </FormLabel>
          </FormItem>
          <FormItem>
            <FormLabel class="[&:has([data-state=checked])>div]:border-primary">
              <FormControl>
                <RadioGroupItem
                  value="dark"
                  class="sr-only"
                />
              </FormControl>
              <div class="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                <div class="space-y-2 rounded-sm bg-slate-950 p-2">
                  <div class="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div class="h-2 w-20 rounded-lg bg-slate-400" />
                    <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div class="h-4 w-4 rounded-full bg-slate-400" />
                    <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div class="h-4 w-4 rounded-full bg-slate-400" />
                    <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                </div>
              </div>
              <span class="block w-full p-2 text-center font-normal">
                Dark
              </span>
            </FormLabel>
          </FormItem>
        </RadioGroup>
      </FormItem>
    </FormField>

    <div class="flex justify-start">
      <Button type="submit">
        Update preferences
      </Button>
    </div>
  </form>
</template>
