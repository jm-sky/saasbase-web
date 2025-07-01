<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import ContractorPicker from '@/domains/contractor/components/ContractorPicker.vue'
import type { IContractorLookup } from '@/domains/contractor/types/contractor.type'
import type { IExpenseCreate } from '@/domains/expense/types/expense.type'

const { t } = useI18n()

defineProps<{
  values: IExpenseCreate
}>()

const seller = defineModel<IContractorLookup | undefined>('seller')
</script>

<template>
  <div class="flex flex-col items-start justify-center gap-y-2 border-b p-6">
    <div v-if="seller" class="w-full">
      <Avatar class="size-7">
        <AvatarImage :src="seller.logoUrl ?? ''" :alt="seller.name" />
        <AvatarFallback>{{ seller.name.slice(0, 2) ?? 'X' }}</AvatarFallback>
      </Avatar>
    </div>

    <ContractorPicker
      :model-value="seller"
      class="w-50 overflow-hidden"
      @update:model-value="seller = $event"
    >
      <template #trigger>
        {{ t('shared.contractor.select') }}
      </template>
    </ContractorPicker>

    <div class="font-bold text-xl text-primary">
      {{ values.seller.name }}
    </div>
    <div class="font-semibold text-sm">
      {{ values.seller.address }}
    </div>
    <div v-if="values.seller.taxId" class="font-semibold text-sm">
      {{ t('financial.fields.taxId') }}: {{ values.seller.taxId }}
    </div>
    <div v-if="values.seller.email" class="font-semibold text-sm">
      {{ values.seller.email }}
    </div>
  </div>
</template>
