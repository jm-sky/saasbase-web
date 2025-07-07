
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'

class InvoiceBatchService {
  async delete(ids: string[]): Promise<void> {
    await api.post(`${apiRoutesMap.invoices}/batch/delete`, { ids })
  }
}

export const invoiceBatchService = new InvoiceBatchService()
