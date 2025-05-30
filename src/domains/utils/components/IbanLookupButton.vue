<script setup lang="ts">
import { SearchCheck } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { config } from '@/config'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { ibanInfoService, type IIbanInfo } from '../services/IbanInfoService'

const { t } = useI18n()

const { country, iban } = defineProps<{
  country?: string
  iban?: string
}>()

const emit = defineEmits<{
  lookup: [ibanInfo: IIbanInfo]
}>()

const loading = ref(false)
const disabled = computed<boolean>(() => !iban)

const sanitizeIban = (iban: string, country: string = config.defaults.country): string => {
  let formattedIban = iban.replace(/\s/g, '')

  if (country && !formattedIban.startsWith(country)) {
    formattedIban = `${country}${formattedIban}`
  }

  return formattedIban
}

const getCountry = (iban: string, country: string = config.defaults.country): string => {
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const countryCode = iban.match(/^[A-Z]{2}/)?.[0]
  return countryCode ?? country
}

const lookupIban = async () => {
  if (disabled.value) return

  try {
    loading.value = true
    const countryCode = getCountry(iban ?? '', country)
    const bankInfo = await ibanInfoService.getIbanInfo(sanitizeIban(iban ?? '', countryCode), countryCode)
    emit('lookup', bankInfo)
  } catch (error) {
    handleErrorWithToast(t('utils.ibanLookup.error'), error)
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Button
    v-tooltip="t('utils.ibanLookup.tooltip')"
    variant="outline"
    type="button"
    size="sm"
    :loading
    :disabled="disabled || loading"
    @click="lookupIban"
  >
    <SearchCheck v-if="!loading" class="size-4" />
  </Button>
</template>
