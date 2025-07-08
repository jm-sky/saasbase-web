import type { IWidgetMetrics } from '@/domains/financial/types/financialWidget.type'

export interface IRevenueWidget {
  month: IWidgetMetrics
  year: IWidgetMetrics
}

export interface IInvoiceWidgetFilters {
  year?: number
  month?: number
}
