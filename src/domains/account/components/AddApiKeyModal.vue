<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Check, Square } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import Input from '@/components/ui/input/Input.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import { apiKeysService, type IApiKey, type ICreateApiKeyData } from '../services/ApiKeys.service'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{ create: [IApiKey] }>()

const schema = toTypedSchema(
  z.object({
    name: z.string().min(2),
    scopes: z.array(z.string()).min(1),
    expiresAt: z.string().optional()
  })
)

const availableScopes = ref(['*', 'read', 'write'])

const { handleSubmit, setFieldValue, setErrors, resetForm, values, isSubmitting } = useForm<ICreateApiKeyData>({
  validationSchema: schema,
  initialValues: {
    name: '',
    scopes: ['*'],
    expiresAt: undefined
  }
})

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const apiKey = await apiKeysService.createApiKey(formValues)
    emit('create', apiKey)
    open.value = false
  } catch (error) {
    handleErrorWithToast(t('apiKeys.add.error'), error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
  }
})

const toggleScope = (scope: string) => {
  setFieldValue('scopes', values.scopes.includes(scope) ? values.scopes.filter(s => s !== scope) : [...values.scopes, scope])
}

watch(open, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script>

<template>
  <ModalComponent
    size="md"
    :title="t('apiKeys.add.title')"
    :description="t('apiKeys.add.description')"
    :open="open"
    @update:open="open = $event"
  >
    <form
      class="grid grid-cols-1 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled v-slot="{ componentField }" name="name" :label="t('apiKeys.fields.name')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled name="scopes" :label="t('apiKeys.fields.scopes')">
        <div class="grid grid-cols-3 gap-2">
          <Checkbox
            v-for="scope in availableScopes"
            :key="scope"
            :value="scope"
            with-content
            :checked="values.scopes.includes(scope)"
            @update:checked="toggleScope(scope)"
          >
            <template #content>
              <Check v-if="values.scopes.includes(scope)" class="size-4" />
              <Square v-else class="size-4" />
              <span class="text-sm">{{ t(`apiKeys.scopes.${scope}`) }}</span>
            </template>
          </Checkbox>
        </div>
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="expiresAt" :label="t('apiKeys.fields.expiresAt')">
        <Input type="date" v-bind="componentField" />
      </FormFieldLabeled>

      <Button
        type="submit"
        class="w-full"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      >
        {{ t('common.save') }}
      </Button>
    </form>
  </ModalComponent>
</template>
