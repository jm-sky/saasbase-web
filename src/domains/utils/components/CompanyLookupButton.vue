<script setup lang="ts">
import { SearchCheck } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { ICompanyLookupResponse } from '../types/companyLookup.type'
import { companyLookupService } from '../services/companyLookup.service'

const { t } = useI18n()

const { country, vatId } = defineProps<{
  country?: string
  vatId?: string
}>()

const emit = defineEmits<{
  lookup: [company: ICompanyLookupResponse]
}>()

const loading = ref(false)
const disabled = computed<boolean>(() => !country || !vatId)

const lookupVatId = async () => {
  if (disabled.value) return

  try {
    loading.value = true
    const company = await companyLookupService.lookup(`${country}`, `${vatId}`)
    emit('lookup', company)
  } catch (error) {
    handleErrorWithToast(t('utils.companyLookup.error'), error)
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Button
    v-tooltip="t('utils.companyLookup.tooltip')"
    variant="outline"
    type="button"
    size="sm"
    :loading
    :disabled="disabled || loading"
    @click="lookupVatId"
  >
    <SearchCheck v-if="!loading" class="size-4" />
  </Button>
</template>
