import { describe, expect, it } from 'vitest'
import { contractorKeys } from '@/domains/contractor/composables/queryKeys'
import { expenseKeys } from '@/domains/expense/composables/queryKeys'
import { invoiceKeys } from '@/domains/invoice/composables/queryKeys'
import { productKeys } from '@/domains/product/composables/queryKeys'
import { projectKeys } from '@/domains/project/composables/queryKeys'
import { taskKeys } from '@/domains/task/composables/queryKeys'

describe('domain query keys', () => {
  it('nests list and detail keys under a stable root', () => {
    expect(invoiceKeys.all).toEqual(['invoices'])
    expect(invoiceKeys.lists()).toEqual(['invoices', 'list'])
    expect(invoiceKeys.list({ page: 1 })).toEqual(['invoices', 'list', { page: 1 }])
    expect(invoiceKeys.detail('inv-1')).toEqual(['invoices', 'detail', 'inv-1'])

    expect(expenseKeys.detail('exp-1')).toEqual(['expenses', 'detail', 'exp-1'])
    expect(productKeys.lists()).toEqual(['products', 'list'])
    expect(projectKeys.list({ search: 'a' })).toEqual(['projects', 'list', { search: 'a' }])
    expect(contractorKeys.detail('c-1')).toEqual(['contractors', 'detail', 'c-1'])
    expect(taskKeys.list({ filter: { projectId: { value: 'p-1' } } })).toEqual([
      'tasks',
      'list',
      { filter: { projectId: { value: 'p-1' } } },
    ])
  })
})
