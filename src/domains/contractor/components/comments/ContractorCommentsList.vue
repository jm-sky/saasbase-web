<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { contractorCommentsService } from '@/domains/contractor/services/ContractorCommentsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import ContractorCommentsListItem from './ContractorCommentsListItem.vue'
import type { IComment } from '@/domains/comment/models/comment.model'
import type { IContractor } from '@/domains/contractor/models/contractor.model'

const { t } = useI18n()

const { contractor } =defineProps<{
  contractor: IContractor
}>()

const comments = ref<IComment[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [10, 20, 50]

const refresh = async () => {
  loading.value = true
  try {
    const res = await contractorCommentsService.index(contractor.id, page.value, pageSize.value)
    comments.value = res.data
    total.value = res.meta.total
  } catch (err) {
    handleErrorWithToast(t('comments.list.error'), err)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const { values, handleSubmit, setErrors, isSubmitting, resetForm } = useForm({
  initialValues: {
    content: '',
  },
})

const handleAdd = handleSubmit(async (values) => {
  try {
    loading.value = true
    await contractorCommentsService.create(contractor.id, values.content)
    resetForm()
    await refresh()
  } catch (error: unknown) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('comments.add.error'), error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-4" :class="{ 'opacity-50': loading }">
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-row items-center gap-2">
        <div class="font-bold">
          Comments
        </div>
      </div>
      <Button :loading variant="ghost" @click="refresh">
        <Icon icon="lucide:refresh-cw" />
      </Button>
    </div>

    <div v-if="comments.length === 0" class="flex justify-center py-4 text-muted-foreground">
      No comments yet
    </div>

    <div v-else class="flex flex-col gap-4">
      <ContractorCommentsListItem
        v-for="comment in comments"
        :key="comment.id"
        :contractor="contractor"
        :comment="comment"
        @refresh="refresh"
      />

      <TablePagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-count="Math.ceil(total / pageSize)"
        :page-size-options="pageSizeOptions"
        class="border rounded-md my-4"
        @update:page="refresh"
        @update:page-size="refresh"
      />
    </div>

    <form class="flex flex-col gap-2" @submit.prevent="handleAdd">
      <FormFieldLabeled
        v-slot="{ componentField }"
        name="content"
        :label="t('comments.add.label')"
      >
        <Textarea
          v-bind="componentField"
          :placeholder="t('comments.add.placeholder')"
        />
      </FormFieldLabeled>
      <Button
        :disabled="!values.content || isSubmitting"
        :loading="isSubmitting"
        type="submit"
      >
        Add Comment
      </Button>
    </form>
  </div>
</template>
