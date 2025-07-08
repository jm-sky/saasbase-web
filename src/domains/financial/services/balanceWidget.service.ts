import api from '@/lib/api'
import type { IBalanceWidget, IOverviewWidget } from '../types/financialWidget.type'
import type { IInvoiceWidgetFilters } from '@/domains/invoice/types/invoiceWidget.type'
import type { IResource } from '@/domains/shared/types/resource.type'

class BalanceWidgetService {
  /**
   * Get total balance widget data (Revenue - Expenses)
   * Shows current month/year balance vs previous month/year with percentage changes
   * Note: This calculates balance from invoices side, but needs expense data from backend
   */
  async getTotalBalance(filters?: IInvoiceWidgetFilters): Promise<IBalanceWidget> {
    const params = filters ? { year: filters.year, month: filters.month } : {}
    const response = await api.get<IResource<IBalanceWidget>>('/financial-reports/balance-widget', { params })
    return response.data.data
  }

  /**
   * Get overview chart data for invoices
   * Returns monthly data for the specified year (default: current year)
   * Includes total revenue for all months in the year
   */
  async getOverviewChart(filters?: IInvoiceWidgetFilters): Promise<IOverviewWidget> {
    const params = filters ? { year: filters.year } : {}
    const response = await api.get<IResource<IOverviewWidget>>('/financial-reports/overview-widget', { params })
    return response.data.data
  }
}

export const balanceWidgetService = new BalanceWidgetService()
