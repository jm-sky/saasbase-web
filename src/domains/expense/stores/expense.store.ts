import { useRouteParams } from '@vueuse/router'
import { defineStore } from 'pinia'
import { ref, type Ref, watch } from 'vue'
import type { IExpense } from '../types/expense.type'

export const useExpenseStore = defineStore('expense', () => {
  const expense: Ref<IExpense | null> = ref(null)
  const expenses: Ref<IExpense[]> = ref([])

  const routeId = useRouteParams<string | undefined>('id')

  const setExpense = (expenseData: IExpense) => expense.value = expenseData

  watch(routeId, (id: string | undefined) => {
    if (id && id !== expense.value?.id) {
      expense.value = null
    }
  },{
    flush: 'pre',
  })

  return {
    expense,
    expenses,
    setExpense,
  }
})
