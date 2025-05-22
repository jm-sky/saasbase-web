<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { tenantService } from '@/domains/tenant/services/TenantService'
import { tenantSchema } from '@/domains/tenant/validation/tenant.schema'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { useNextRedirect } from '@/lib/useNextRedirect'
import { isValidationError } from '@/lib/validation'
import type { ITenantCreate } from '@/domains/tenant/types/tenant.type'

const router = useRouter()
const { t } = useI18n()
const { toast } = useToast()
const { redirectTo } = useNextRedirect()

const { isSubmitting, handleSubmit, resetForm, setErrors } = useForm<ITenantCreate>({
  validationSchema: tenantSchema,
  initialValues: {
    name: '',
    email: '',
    phone: '',
    website: '',
    country: '',
    description: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await tenantService.create(values)

    toast.success(t('tenant.create.success'))

    await router.push(redirectTo.value)

  } catch (error: unknown) {
    console.error('[CreateTenantPage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('tenant.create.error'), error)
  }
})
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col text-center space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ t('tenant.create.title') }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ t('tenant.create.description') }}
        </p>
      </div>

      <form class="flex flex-col gap-2" @submit="onSubmit">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="name"
          :label="t('tenant.fields.name')"
          :disabled="isSubmitting"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="email"
          :label="t('tenant.fields.email')"
          :disabled="isSubmitting"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="phone"
          :label="t('tenant.fields.phone')"
          :disabled="isSubmitting"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="website"
          :label="t('tenant.fields.website')"
          :disabled="isSubmitting"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <Button
          type="submit"
          class="w-full mt-4"
          :disabled="isSubmitting"
          :loading="isSubmitting"
        >
          {{ t('auth.register.submit') }}
        </Button>

        <Button
          type="button"
          variant="outline"
          class="w-full"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="resetForm()"
        >
          Reset
        </Button>
      </form>
    </div>
  </GuestLayout>
</template>
