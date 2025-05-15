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
import type { IContractorContact } from '@/domains/contractor/models/contractor.model'

const { t } = useI18n()

defineProps<{
  contact: IContractorContact
}>()

const emit = defineEmits<{
  edit: [contact: IContractorContact]
  delete: [contact: IContractorContact]
}>()
</script>

<template>
  <div class="border rounded-md px-3 py-2 grid md:grid-cols-[1fr_1fr_auto] items-center gap-x-3 gap-y-1.5">
    <div class="flex flex-row gap-2 items-center">
      <Icon icon="lucide:user" class="text-muted-foreground" />
      {{ contact.name }}
    </div>
    <div class="text-sm text-muted-foreground">
      <span v-if="contact.position" class="bg-muted-foreground/10 px-2 rounded">{{ contact.position }}</span>
    </div>
    <div class="flex flex-row gap-1 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="size-8">
            <Icon icon="lucide:more-horizontal" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            class="cursor-pointer gap-2 hover:bg-accent"
            @click="emit('edit', contact)"
          >
            <Icon icon="lucide:edit" />
            {{ t('common.edit') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            class="cursor-pointer gap-2 hover:bg-accent"
            @click="emit('delete', contact)"
          >
            <Icon icon="lucide:trash" />
            {{ t('common.delete') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div v-if="contact.description" class="col-span-full -mt-1 py-1 text-sm text-muted-foreground">
      {{ contact.description }}
    </div>
    <div class="col-span-full flex flex-col gap-1 border-l-4 pl-2 text-sm text-muted-foreground">
      <div class="flex flex-row gap-2 items-center">
        <Icon icon="lucide:mail" class="text-muted-foreground" />
        <a v-if="contact.email" :href="`mailto:${contact.email}`" class="hover:underline">{{ contact.email }}</a>
        <span v-else>-</span>
        <CopyToClipboard v-if="contact.email" :text="contact.email" class="ml-1" />
      </div>
      <div class="flex flex-row gap-2 items-center">
        <Icon icon="lucide:phone" class="text-muted-foreground" />
        <a v-if="contact.phone" :href="`tel:${contact.phone}`" class="hover:underline">{{ contact.phone }}</a>
        <span v-else>-</span>
        <CopyToClipboard v-if="contact.phone" :text="contact.phone" class="ml-1" />
      </div>
    </div>
  </div>
</template>
