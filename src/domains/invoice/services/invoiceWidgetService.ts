import api from '@/lib/api'
import type { IInvoiceWidgetFilters, IRevenueWidget } from '@/domains/invoice/types/invoiceWidget.type'
import type { IResource } from '@/domains/shared/types/resource.type'

class InvoiceWidgetService {
  /**
   * Get total revenue widget data
   * Shows current month/year revenue vs previous month/year with percentage changes
   */
  async getTotalRevenue(filters?: IInvoiceWidgetFilters): Promise<IRevenueWidget> {
    const params = filters ? { year: filters.year } : {}
    const response = await api.get<IResource<IRevenueWidget>>('/financial-reports/revenue-widget', { params })
    return response.data.data
  }
}

export const invoiceWidgetService = new InvoiceWidgetService()
