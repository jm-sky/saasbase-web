<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FileDropZoneSlot from '@/components/Inputs/FileDropZoneSlot.vue'
import FileUploadClickable from '@/components/Inputs/FileUploadClickable.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'

interface IConfirmIdentityByTrustedProfileForm {
  file: File
}

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  done: []
}>()

const draggedFiles = ref<File[]>([])

const { values, setFieldValue, handleSubmit } = useForm<IConfirmIdentityByTrustedProfileForm>({
  initialValues: {
    file: undefined,
  },
})

const onUpdateDraggedFiles = (files: File[]) => {
  draggedFiles.value = files
}

const cancel = () => {
  open.value = false
}

const onDone = () => {
  emit('done')
  open.value = false
}

const onSubmit = handleSubmit(() => {
  onDone()
})
</script>

<template>
  <ModalComponent
    size="md"
    :title="t('identityConfirmation.trustedProfile.title')"
    :description="t('identityConfirmation.trustedProfile.description')"
    :open="open"
    @update:open="open = $event"
  >
    <div class="grid grid-cols-2 items-center gap-4 border rounded-lg px-4 py-2">
      <div class="font-semibold text-sm">
        {{ t('identityConfirmation.stepOne', 'Step 1') }}
      </div>

      <Button variant="default" class="w-full">
        {{ t('identityConfirmation.trustedProfile.download', 'Download XML') }}
      </Button>
    </div>

    <form class="grid grid-cols-2 items-center gap-4 border rounded-lg px-4 py-2" @submit="onSubmit">
      <div>
        <div class="font-semibold text-sm">
          {{ t('identityConfirmation.stepTwo', 'Step 2') }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ t('identityConfirmation.trustedProfile.uploadSignedXml', 'Upload signed XML') }}
        </div>
      </div>

      <FileDropZoneSlot
        :hide-label="true"
        :dragged-files="[values.file]"
        class="p-4 rounded-lg border border-dashed border-gray-200 hover:bg-primary-50/50 hover:border-primary"
        @update:dragged-files="onUpdateDraggedFiles"
      >
        <FileUploadClickable
          v-model:files="draggedFiles"
          @update:files="setFieldValue('file', $event[0])"
        />
      </FileDropZoneSlot>
      <Button
        type="submit"
        variant="default"
        class="w-full col-span-full"
        :disabled="!values.file"
      >
        {{ t('common.submit') }}
      </Button>
    </form>

    <Button variant="outline" class="w-full" @click="cancel">
      {{ t('common.cancel') }}
    </Button>
  </ModalComponent>
</template>
