import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type {
  IContractorCombinedCreate,
  IContractorPreferencesUpdate,
  IContractorUpdate,
} from '../types/contractor.type'
import { contractorService } from '../services/ContractorService'
import { contractorKeys } from './queryKeys'

export function useCreateContractor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IContractorCombinedCreate) => contractorService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractorKeys.lists() })
    },
  })
}

export function useUpdateContractor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: IContractorUpdate }) => contractorService.update(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: contractorKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: contractorKeys.detail(id) })
    },
  })
}

export function useUpdateContractorPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: IContractorPreferencesUpdate }) => contractorService.updatePreferences(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: contractorKeys.detail(id) })
    },
  })
}

export function useDeleteContractor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => contractorService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractorKeys.lists() })
    },
  })
}
