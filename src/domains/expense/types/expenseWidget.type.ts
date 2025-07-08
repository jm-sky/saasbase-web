import type { IWidgetMetrics } from '@/domains/financial/types/financialWidget.type'

export interface IExpenseWidget {
  month: IWidgetMetrics
  year: IWidgetMetrics
}

export interface IExpenseWidgetFilters {
  year?: number
  month?: number
}
