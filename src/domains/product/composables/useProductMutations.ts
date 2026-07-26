import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { productService } from '../services/ProductService'
import { productKeys } from './queryKeys'
import type { IProductCreate, IProductUpdate } from '../types/product.type'

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IProductCreate) => productService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<IProductUpdate> }) => productService.update(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
