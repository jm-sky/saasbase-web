<script setup lang="ts">
import { Edit, MoreVertical, Star, Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getResetPeriodLabel } from '@/domains/invoice/utils/numberingTemplateUtils'
import type { IInvoiceNumberingTemplate } from '@/domains/invoice/types/numberingTemplate.type'

interface Props {
  template: IInvoiceNumberingTemplate
}

interface Emits {
  edit: [template: IInvoiceNumberingTemplate]
  setDefault: [template: IInvoiceNumberingTemplate]
  delete: [id: string]
}

defineProps<Props>()
defineEmits<Emits>()

const { t } = useI18n()
</script>

<template>
  <Card class="shadow-md hover:shadow-lg">
    <CardHeader class="pb-2">
      <div class="flex items-center justify-between">
        <CardTitle class="text-sm">
          {{ template.name }}
        </CardTitle>
        <div class="flex items-center gap-2">
          <Badge v-if="template.isDefault" variant="info-outline">
            {{ t('invoice.numberingTemplate.states.default') }}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="sm">
                <MoreVertical class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem hoverable @click="$emit('edit', template)">
                <Edit class="size-4 mr-2" />
                {{ t('invoice.numberingTemplate.actions.edit') }}
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="!template.isDefault"
                hoverable
                @click="$emit('setDefault', template)"
              >
                <Star class="size-4 mr-2" />
                {{ t('invoice.numberingTemplate.actions.setDefault') }}
              </DropdownMenuItem>
              <DropdownMenuItem
                :disabled="template.isDefault"
                hoverable
                variant="destructive"
                @click="$emit('delete', template.id)"
              >
                <Trash2 class="size-4 mr-2" />
                {{ t('invoice.numberingTemplate.actions.delete') }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-2 text-sm">
        <div class="font-mono bg-muted p-2 rounded">
          {{ template.format }}
        </div>
        <div class="flex justify-between text-muted-foreground">
          <span>{{ t('invoice.numberingTemplate.form.nextNumber') }}: {{ template.nextNumber }}</span>
          <span>{{ t(getResetPeriodLabel(template.resetPeriod)) }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
