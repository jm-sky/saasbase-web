import { beforeEach, describe, expect, it, vi } from 'vitest'
import { contractorKeys } from '@/domains/contractor/composables/queryKeys'
import {
  useCreateContractor,
  useDeleteContractor,
  useUpdateContractor,
  useUpdateContractorPreferences,
} from '@/domains/contractor/composables/useContractorMutations'
import { expenseKeys } from '@/domains/expense/composables/queryKeys'
import {
  useCreateExpense,
  useDeleteExpense,
  useStartExpenseOcr,
  useUpdateExpense,
} from '@/domains/expense/composables/useExpenseMutations'
import {
  useCreateNumberingTemplate,
  useDeleteNumberingTemplate,
  useSetDefaultNumberingTemplate,
  useUpdateNumberingTemplate,
} from '@/domains/invoice/composables/useNumberingTemplateMutations'
import { numberingTemplateKeys } from '@/domains/invoice/composables/numberingTemplateQueryKeys'
import {
  useCreateInvoice,
  useDeleteInvoice,
  useUpdateInvoice,
} from '@/domains/invoice/composables/useInvoiceMutations'
import { invoiceKeys } from '@/domains/invoice/composables/queryKeys'
import { productKeys } from '@/domains/product/composables/queryKeys'
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from '@/domains/product/composables/useProductMutations'
import { projectKeys } from '@/domains/project/composables/queryKeys'
import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from '@/domains/project/composables/useProjectMutations'
import { mountComposable } from '@/test/mountComposable'

vi.mock('@/domains/contractor/services/ContractorService', () => ({
  contractorService: {
    create: vi.fn().mockResolvedValue({ id: 'contractor-1' }),
    update: vi.fn().mockResolvedValue({ id: 'contractor-1' }),
    updatePreferences: vi.fn().mockResolvedValue({ id: 'contractor-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock('@/domains/expense/services/expenseService', () => ({
  expenseService: {
    create: vi.fn().mockResolvedValue({ id: 'expense-1' }),
    update: vi.fn().mockResolvedValue({ id: 'expense-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
    startOcr: vi.fn().mockResolvedValue({ id: 'expense-1' }),
  },
}))

vi.mock('@/domains/invoice/services/invoiceService', () => ({
  invoiceService: {
    create: vi.fn().mockResolvedValue({ id: 'invoice-1' }),
    update: vi.fn().mockResolvedValue({ id: 'invoice-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock('@/domains/product/services/ProductService', () => ({
  productService: {
    create: vi.fn().mockResolvedValue({ id: 'product-1' }),
    update: vi.fn().mockResolvedValue({ id: 'product-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock('@/domains/invoice/services/NumberingTemplate.service', () => ({
  numberingTemplateService: {
    create: vi.fn().mockResolvedValue({ id: 'template-1' }),
    update: vi.fn().mockResolvedValue({ id: 'template-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
    setDefault: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock('@/domains/project/services/ProjectService', () => ({
  projectService: {
    create: vi.fn().mockResolvedValue({ id: 'project-1' }),
    update: vi.fn().mockResolvedValue({ id: 'project-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('CRUD mutation invalidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('invalidates contractor list on create and delete', async () => {
    const { result: createMutation, queryClient: createClient } = mountComposable(() => useCreateContractor())
    const createInvalidate = vi.spyOn(createClient, 'invalidateQueries')
    await createMutation.mutateAsync({} as never)
    expect(createInvalidate).toHaveBeenCalledWith({ queryKey: contractorKeys.lists() })

    const { result: deleteMutation, queryClient: deleteClient } = mountComposable(() => useDeleteContractor())
    const deleteInvalidate = vi.spyOn(deleteClient, 'invalidateQueries')
    await deleteMutation.mutateAsync('contractor-1')
    expect(deleteInvalidate).toHaveBeenCalledWith({ queryKey: contractorKeys.lists() })
  })

  it('invalidates contractor list and detail on update', async () => {
    const { result, queryClient } = mountComposable(() => useUpdateContractor())
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    await result.mutateAsync({ id: 'contractor-1', data: {} })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractorKeys.lists() })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractorKeys.detail('contractor-1') })
  })

  it('invalidates contractor detail on preferences update', async () => {
    const { result, queryClient } = mountComposable(() => useUpdateContractorPreferences())
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    await result.mutateAsync({ id: 'contractor-1', data: {} })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractorKeys.detail('contractor-1') })
    expect(invalidateSpy).not.toHaveBeenCalledWith({ queryKey: contractorKeys.lists() })
  })

  it('invalidates expense list on create and detail plus list on update', async () => {
    const { result: createMutation, queryClient: createClient } = mountComposable(() => useCreateExpense())
    const createInvalidate = vi.spyOn(createClient, 'invalidateQueries')
    await createMutation.mutateAsync({} as never)
    expect(createInvalidate).toHaveBeenCalledWith({ queryKey: expenseKeys.lists() })

    const { result: updateMutation, queryClient: updateClient } = mountComposable(() => useUpdateExpense())
    const updateInvalidate = vi.spyOn(updateClient, 'invalidateQueries')
    await updateMutation.mutateAsync({ id: 'expense-1', data: {} })

    expect(updateInvalidate).toHaveBeenCalledWith({ queryKey: expenseKeys.lists() })
    expect(updateInvalidate).toHaveBeenCalledWith({ queryKey: expenseKeys.detail('expense-1') })
  })

  it('invalidates expense detail and list after OCR start', async () => {
    const { result, queryClient } = mountComposable(() => useStartExpenseOcr())
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    await result.mutateAsync({ id: 'expense-1' })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: expenseKeys.detail('expense-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: expenseKeys.lists() })
  })

  it('invalidates invoice list and detail on update', async () => {
    const { result, queryClient } = mountComposable(() => useUpdateInvoice())
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    await result.mutateAsync({ id: 'invoice-1', data: {} })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: invoiceKeys.lists() })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: invoiceKeys.detail('invoice-1') })
  })

  it('invalidates product list and detail on update', async () => {
    const { result, queryClient } = mountComposable(() => useUpdateProduct())
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    await result.mutateAsync({ id: 'product-1', data: {} })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: productKeys.lists() })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: productKeys.detail('product-1') })
  })

  it('invalidates project list on create and delete', async () => {
    const { result: createMutation, queryClient: createClient } = mountComposable(() => useCreateProject())
    const createInvalidate = vi.spyOn(createClient, 'invalidateQueries')
    await createMutation.mutateAsync({} as never)
    expect(createInvalidate).toHaveBeenCalledWith({ queryKey: projectKeys.lists() })

    const { result: deleteMutation, queryClient: deleteClient } = mountComposable(() => useDeleteProject())
    const deleteInvalidate = vi.spyOn(deleteClient, 'invalidateQueries')
    await deleteMutation.mutateAsync('project-1')
    expect(deleteInvalidate).toHaveBeenCalledWith({ queryKey: projectKeys.lists() })
  })

  it('invalidates delete mutations for expense, invoice, and product lists', async () => {
    const { result: deleteExpense, queryClient: expenseClient } = mountComposable(() => useDeleteExpense())
    const expenseInvalidate = vi.spyOn(expenseClient, 'invalidateQueries')
    await deleteExpense.mutateAsync('expense-1')
    expect(expenseInvalidate).toHaveBeenCalledWith({ queryKey: expenseKeys.lists() })

    const { result: deleteInvoice, queryClient: invoiceClient } = mountComposable(() => useDeleteInvoice())
    const invoiceInvalidate = vi.spyOn(invoiceClient, 'invalidateQueries')
    await deleteInvoice.mutateAsync('invoice-1')
    expect(invoiceInvalidate).toHaveBeenCalledWith({ queryKey: invoiceKeys.lists() })

    const { result: deleteProduct, queryClient: productClient } = mountComposable(() => useDeleteProduct())
    const productInvalidate = vi.spyOn(productClient, 'invalidateQueries')
    await deleteProduct.mutateAsync('product-1')
    expect(productInvalidate).toHaveBeenCalledWith({ queryKey: productKeys.lists() })
  })

  it('invalidates project detail on update', async () => {
    const { result, queryClient } = mountComposable(() => useUpdateProject())
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    await result.mutateAsync({ id: 'project-1', data: {} })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: projectKeys.lists() })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: projectKeys.detail('project-1') })
  })

  it('invalidates invoice and product lists on create', async () => {
    const { result: invoiceMutation, queryClient: invoiceClient } = mountComposable(() => useCreateInvoice())
    const invoiceInvalidate = vi.spyOn(invoiceClient, 'invalidateQueries')
    await invoiceMutation.mutateAsync({} as never)
    expect(invoiceInvalidate).toHaveBeenCalledWith({ queryKey: invoiceKeys.lists() })

    const { result: productMutation, queryClient: productClient } = mountComposable(() => useCreateProduct())
    const productInvalidate = vi.spyOn(productClient, 'invalidateQueries')
    await productMutation.mutateAsync({} as never)
    expect(productInvalidate).toHaveBeenCalledWith({ queryKey: productKeys.lists() })
  })

  it('invalidates numbering template list on create, update, delete, and set default', async () => {
    const tenantId = 'tenant-1'

    const { result: createMutation, queryClient: createClient } = mountComposable(() => useCreateNumberingTemplate())
    const createInvalidate = vi.spyOn(createClient, 'invalidateQueries')
    await createMutation.mutateAsync({} as never)
    expect(createInvalidate).toHaveBeenCalledWith({ queryKey: numberingTemplateKeys.lists() })

    const { result: updateMutation, queryClient: updateClient } = mountComposable(() => useUpdateNumberingTemplate())
    const updateInvalidate = vi.spyOn(updateClient, 'invalidateQueries')
    await updateMutation.mutateAsync({ id: 'template-1', data: {} })
    expect(updateInvalidate).toHaveBeenCalledWith({ queryKey: numberingTemplateKeys.lists() })
    expect(updateInvalidate).toHaveBeenCalledWith({ queryKey: numberingTemplateKeys.detail('template-1') })

    const { result: deleteMutation, queryClient: deleteClient } = mountComposable(() => useDeleteNumberingTemplate())
    const deleteInvalidate = vi.spyOn(deleteClient, 'invalidateQueries')
    await deleteMutation.mutateAsync('template-1')
    expect(deleteInvalidate).toHaveBeenCalledWith({ queryKey: numberingTemplateKeys.lists() })

    const { result: setDefaultMutation, queryClient: setDefaultClient } = mountComposable(() => useSetDefaultNumberingTemplate())
    const setDefaultInvalidate = vi.spyOn(setDefaultClient, 'invalidateQueries')
    await setDefaultMutation.mutateAsync('template-1')
    expect(setDefaultInvalidate).toHaveBeenCalledWith({ queryKey: numberingTemplateKeys.lists() })

    expect(numberingTemplateKeys.list(tenantId)).toEqual(['numbering-templates', 'list', tenantId])
  })
})
