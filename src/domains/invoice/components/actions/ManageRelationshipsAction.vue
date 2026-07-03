<script setup lang="ts">
import { Link } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/toast'
import type { IInvoice } from '../../types/invoice.type'

const { t } = useI18n()
const { toast } = useToast()

defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

// No backend endpoint exists for this yet — previously faked a delay then
// claimed success regardless, which was actively misleading rather than
// just an unfinished feature.
const manageRelationship = () => {
  toast.info(t('invoice.actions.notImplemented'))
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        v-if="variant === 'button'"
        variant="outline"
        size="sm"
        :disabled="!invoice && !invoices?.length"
      >
        <Link class="size-4" />
        {{ t('invoice.actions.relationships.title', 'Manage Relationships') }}
      </Button>
      <DropdownMenuItem
        v-else
        hoverable
        :disabled="!invoice && !invoices?.length"
      >
        <Link class="size-4 mr-2" />
        {{ t('invoice.actions.relationships.title', 'Manage Relationships') }}
      </DropdownMenuItem>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        class="cursor-pointer"
        @click="manageRelationship"
      >
        {{ t('invoice.actions.relationships.project', 'Link to Project') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer"
        @click="manageRelationship"
      >
        {{ t('invoice.actions.relationships.user', 'Link to User') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer"
        @click="manageRelationship"
      >
        {{ t('invoice.actions.relationships.contractor', 'Link to Contractor') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
