<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import RichTextEditor from '@/components/Inputs/RichTextEditor.vue'
import Button from '@/components/ui/button/Button.vue'
import { FormField } from '@/components/ui/form'
import FormControl from '@/components/ui/form/FormControl.vue'
import FormDescription from '@/components/ui/form/FormDescription.vue'
import FormItem from '@/components/ui/form/FormItem.vue'
import FormLabel from '@/components/ui/form/FormLabel.vue'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import Input from '@/components/ui/input/Input.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IFeed, IFeedCreate } from '../types/feed.type'
import { feedService } from '../services/FeedService'

const  { t } = useI18n()
const loading = ref(false)
const html = ref('To jest mój pierwszy post')

const { handleSubmit, setFieldValue, resetForm } = useForm<IFeedCreate>({
  initialValues: {
    title: 'Mój pierwszy post',
    content: 'To jest mój pierwszy post',
  },
})

const emit = defineEmits<{
  create: [feed: IFeed]
}>()

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    const feed = await feedService.create(values)
    emit('create', feed)
    resetForm()
  } catch (error) {
    handleErrorWithToast(t('feed.create.error'), error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-4 border rounded-md p-4 shadow-sm">
    <h1 class="text-lg font-semibold">
      {{ t('feed.create.title') }}
    </h1>
    <form @submit="onSubmit">
      <div class="flex flex-col gap-2">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>{{ t('feed.fields.title') }}</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="content">
          <FormItem>
            <FormLabel>{{ t('feed.fields.content') }}</FormLabel>
            <FormControl>
              <RichTextEditor
                v-model="html"
                :name="componentField.name"
                @update:markdown="setFieldValue('content', $event)"
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <Button
        type="submit"
        :disabled="loading"
        class="w-full"
        variant="primary"
      >
        {{ t('feed.create.submit') }}
      </Button>
    </form>
  </div>
</template>