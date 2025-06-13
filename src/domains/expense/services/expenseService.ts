
import { buildSpatieQuery } from '@/domains/shared/helpers/filtering'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { SortingState } from '@tanstack/vue-table'
import type { IExpense, IExpenseCreate } from '@/domains/expense/types/expense.type'
import type { FilterDefinition, IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IExpenseFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<string, FilterDefinition>
  sort?: SortingState
}

class ExpenseService {
  async index(filters?: IExpenseFilters): Promise<IResourceCollection<IExpense>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = await api.get<IResourceCollection<IExpense>>(apiRoutesMap.expenses, { params })
    return response.data
  }

  async get(id: string): Promise<IExpense> {
    const response = await api.get<IResource<IExpense>>(`${apiRoutesMap.expenses}/${id}`)
    return response.data.data
  }

  async create(invoice: IExpenseCreate): Promise<IExpense> {
    const response = await api.post<IResource<IExpense>>(apiRoutesMap.expenses, invoice)
    return response.data.data
  }

  async update(id: string, invoice: Partial<IExpense>): Promise<IExpense> {
    const response = await api.patch<IResource<IExpense>>(`${apiRoutesMap.expenses}/${id}`, invoice)
    return response.data.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.expenses}/${id}`)
  }

  async export(filters?: IExpenseFilters): Promise<Blob> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = await api.get(`${apiRoutesMap.expenses}/export`, { params, responseType: 'blob' })
    return response.data
  }
}

export const expenseService = new ExpenseService()
