<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import CopyToClipboard from '@/components/CopyToClipboard.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fullAddress } from '@/lib/fullAddress'
import type { IContractorAddress } from '@/domains/contractor/types/contractor.type'

const { t } = useI18n()

defineProps<{
  address: IContractorAddress
}>()

const emit = defineEmits<{
  setDefault: [address: IContractorAddress]
  edit: [address: IContractorAddress]
  delete: [address: IContractorAddress]
}>()
</script>

<template>
  <div
    class="border rounded-md px-3 py-2 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_1fr_1fr_auto] items-center gap-x-3 gap-y-1"
    :class="{ 'border-primary/50 ring-1 ring-primary/30': address.isDefault }"
  >
    <div class="flex flex-row gap-2 items-center max-w-full overflow-hidden order-0">
      <Icon icon="lucide:map-pin" :class="address.isDefault ? 'text-primary' : 'text-muted-foreground'" />
      <span class="truncate">
        {{ t(`address.type.${address.type}`) ?? 'Default' }}
      </span>
    </div>

    <div class="col-span-full md:col-span-1 order-2 md:order-1">
      {{ fullAddress(address) }}
      <CopyToClipboard :text="fullAddress(address)" class="ml-1" />
    </div>

    <div class="col-span-full text-sm text-muted-foreground order-3 md:order-2">
      {{ address.description }}
    </div>

    <div class="flex flex-row gap-1 justify-end order-1 md:order-1">
      <Button
        v-tooltip="t('address.setDefault')"
        variant="ghost"
        class="size-8 text-muted-foreground"
        @click="emit('setDefault', address)"
      >
        <Icon icon="lucide:star" :class="{ '[&>path]:fill-current' : address.isDefault}" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="size-8">
            <Icon icon="lucide:more-horizontal" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            class="cursor-pointer gap-2 hover:bg-accent"
            @click="emit('edit', address)"
          >
            <Icon icon="lucide:edit" />
            {{ t('common.edit') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            class="cursor-pointer gap-2 hover:bg-accent"
            @click="emit('delete', address)"
          >
            <Icon icon="lucide:trash" />
            {{ t('common.delete') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
