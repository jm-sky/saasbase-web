import api from '@/lib/api'
import type { IExpenseWidget, IExpenseWidgetFilters } from '@/domains/expense/types/expenseWidget.type'
import type { IResource } from '@/domains/shared/types/resource.type'

class ExpenseWidgetService {
  /**
   * Get total expenses widget data
   * Shows current month/year expenses vs previous month/year with percentage changes
   */
  async getTotalExpenses(filters?: IExpenseWidgetFilters): Promise<IExpenseWidget> {
    const params = filters ? { year: filters.year, month: filters.month } : {}
    const response = await api.get<IResource<IExpenseWidget>>('/financial-reports/expenses-widget', { params })
    return response.data.data
  }
}

export const expenseWidgetService = new ExpenseWidgetService()
