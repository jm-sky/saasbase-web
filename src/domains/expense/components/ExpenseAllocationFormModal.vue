<script setup lang="ts">
import { Plus, Trash2 } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { useAvailableAllocationDimensions } from '@/domains/expense/composables/useExpenseAllocationQueries'
import { useStoreExpenseAllocations } from '@/domains/expense/composables/useExpenseMutations'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IAllocationDimensionData } from '@/domains/expense/types/expenseDimension.type'

interface AllocationFormRow {
  key: string
  amount: string
  note: string
  dimensionSelections: Record<string, string>
}

const props = defineProps<{
  expenseId: string
  totalGross: number
  currency: string
}>()

const open = defineModel<boolean>('open', { default: false })

const { t, locale } = useI18n()
const { data: dimensions, isPending: loadingDimensions } = useAvailableAllocationDimensions(() => open.value)
const { mutateAsync: storeAllocations, isPending: saving } = useStoreExpenseAllocations()

const rows = ref<AllocationFormRow[]>([])

const dimensionLabel = (dim: IAllocationDimensionData) =>
  locale.value.startsWith('pl') ? dim.label : dim.labelEN

const itemLabel = (item: { displayName?: string | null, name?: string | null, code?: string | null, id: string }) =>
  item.displayName ?? item.name ?? item.code ?? item.id

const NONE_DIMENSION = '__none__'

const initDimensionSelections = (): Record<string, string> => {
  const selections: Record<string, string> = {}
  for (const dim of dimensions.value ?? []) {
    selections[dim.dimensionType] = NONE_DIMENSION
  }
  return selections
}

const createRow = (amount = ''): AllocationFormRow => ({
  key: crypto.randomUUID(),
  amount,
  note: '',
  dimensionSelections: initDimensionSelections(),
})

const resetRows = () => {
  rows.value = [createRow(String(props.totalGross))]
}

watch(open, (isOpen) => {
  if (isOpen) resetRows()
})

watch(dimensions, () => {
  if (!open.value) return
  for (const row of rows.value) {
    for (const dim of dimensions.value ?? []) {
      if (!row.dimensionSelections[dim.dimensionType]) {
        row.dimensionSelections[dim.dimensionType] = NONE_DIMENSION
      }
    }
  }
})

const totalEntered = computed(() =>
  rows.value.reduce((sum, row) => sum + (Number.parseFloat(row.amount) || 0), 0),
)

const formatMoney = (value: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: props.currency || 'PLN' }).format(value)

const buildPayload = () => {
  return rows.value.map((row) => {
    const amount = Number.parseFloat(row.amount)
    const dimensions = Object.entries(row.dimensionSelections)
      .filter(([, id]) => Boolean(id) && id !== NONE_DIMENSION)
      .map(([type, id]) => ({ type, id }))

    return {
      amount,
      note: row.note.trim() || undefined,
      dimensions: dimensions.length ? dimensions : undefined,
    }
  })
}

const validate = (): boolean => {
  if (!rows.value.length) {
    toast.error(t('expense.allocation.form.noRows'))
    return false
  }

  for (const row of rows.value) {
    const amount = Number.parseFloat(row.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error(t('expense.allocation.form.invalidAmount'))
      return false
    }
  }

  if (totalEntered.value > props.totalGross + 0.001) {
    toast.error(t('expense.allocation.form.exceedsTotal', { total: formatMoney(props.totalGross) }))
    return false
  }

  return true
}

const addRow = () => {
  rows.value.push(createRow())
}

const removeRow = (key: string) => {
  if (rows.value.length <= 1) return
  rows.value = rows.value.filter(row => row.key !== key)
}

const onSubmit = async () => {
  if (!validate()) return

  try {
    await storeAllocations({
      expenseId: props.expenseId,
      allocations: buildPayload(),
    })
    toast.success(t('expense.allocation.form.success'))
    open.value = false
  } catch (error) {
    handleErrorWithToast(t('expense.allocation.form.error'), error)
  }
}
</script>

<template>
  <ModalComponent
    v-model:open="open"
    :title="t('expense.allocation.form.title')"
    :description="t('expense.allocation.form.description')"
    size="xl"
  >
    <div v-if="loadingDimensions" class="text-sm text-muted-foreground">
      {{ t('common.loading') }}
    </div>

    <template v-else>
      <p class="text-sm text-muted-foreground mb-4">
        {{ t('expense.allocation.form.summary', {
          entered: formatMoney(totalEntered),
          total: formatMoney(totalGross),
        }) }}
      </p>

      <div class="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
        <div
          v-for="(row, index) in rows"
          :key="row.key"
          class="border rounded-lg p-4 space-y-3"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-medium">
              {{ t('expense.allocation.form.line', { n: index + 1 }) }}
            </span>
            <Button
              v-if="rows.length > 1"
              type="button"
              variant="ghost"
              size="sm"
              @click="removeRow(row.key)"
            >
              <Trash2 class="size-4" />
            </Button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <Label>{{ t('expense.allocation.form.amount') }}</Label>
              <Input
                v-model="row.amount"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
            <div class="space-y-1">
              <Label>{{ t('expense.allocation.form.note') }}</Label>
              <Input v-model="row.note" type="text" />
            </div>
          </div>

          <div
            v-if="dimensions?.length"
            class="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <div
              v-for="dim in dimensions"
              :key="dim.dimensionType"
              class="space-y-1"
            >
              <Label>{{ dimensionLabel(dim) }}</Label>
              <Select
                :model-value="row.dimensionSelections[dim.dimensionType] ?? NONE_DIMENSION"
                @update:model-value="row.dimensionSelections[dim.dimensionType] = ($event as string) ?? NONE_DIMENSION"
              >
                <SelectTrigger>
                  <SelectValue :placeholder="t('expense.allocation.form.dimensionPlaceholder')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="NONE_DIMENSION">
                    {{ t('expense.allocation.form.dimensionNone') }}
                  </SelectItem>
                  <SelectItem
                    v-for="item in dim.items"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ itemLabel(item) }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        class="mt-4"
        @click="addRow"
      >
        <Plus class="size-4 mr-1" />
        {{ t('expense.allocation.form.addLine') }}
      </Button>
    </template>

    <template #footer>
      <Button type="button" variant="outline" @click="open = false">
        {{ t('common.cancel') }}
      </Button>
      <Button
        type="button"
        variant="primary"
        :loading="saving"
        :disabled="loadingDimensions"
        @click="onSubmit"
      >
        {{ t('expense.allocation.form.submit') }}
      </Button>
    </template>
  </ModalComponent>
</template>
