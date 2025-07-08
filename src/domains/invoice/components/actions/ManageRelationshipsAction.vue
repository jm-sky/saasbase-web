<script setup lang="ts">
import { Link } from 'lucide-vue-next'
import { ref } from 'vue'
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

const loading = ref(false)

const manageRelationship = async (type: 'project' | 'user' | 'contractor') => {
  loading.value = true
  try {
    // TODO: Implement service integration
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(t(`invoice.actions.relationships.${type}.success`, `${type} relationship managed successfully`))
  } catch (error) {
    console.error(`Failed to manage ${type} relationship:`, error)
    toast.error(t(`invoice.actions.relationships.${type}.error`, `Failed to manage ${type} relationship`))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        v-if="variant === 'button'"
        variant="outline"
        size="sm"
        :disabled="loading || (!invoice && !invoices?.length)"
      >
        <Link class="size-4" />
        {{ t('invoice.actions.relationships.title', 'Manage Relationships') }}
      </Button>
      <DropdownMenuItem
        v-else
        hoverable
        :disabled="loading || (!invoice && !invoices?.length)"
      >
        <Link class="size-4 mr-2" />
        {{ t('invoice.actions.relationships.title', 'Manage Relationships') }}
      </DropdownMenuItem>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        class="cursor-pointer"
        @click="manageRelationship('project')"
      >
        {{ t('invoice.actions.relationships.project', 'Link to Project') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer"
        @click="manageRelationship('user')"
      >
        {{ t('invoice.actions.relationships.user', 'Link to User') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer"
        @click="manageRelationship('contractor')"
      >
        {{ t('invoice.actions.relationships.contractor', 'Link to Contractor') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
