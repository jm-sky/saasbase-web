import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import { contractorService, type IContractorFilters } from '../services/ContractorService'
import { contractorKeys } from './queryKeys'
import type { MaybeRefOrGetter } from 'vue'

export function useContractorList(filters: MaybeRefOrGetter<IContractorFilters>) {
  return useQuery({
    queryKey: computed(() => contractorKeys.list(toValue(filters))),
    queryFn: () => contractorService.index(toValue(filters)),
    // Keeps the previous page's rows on screen while the next page/filter
    // change is loading, instead of flashing an empty table.
    placeholderData: previousData => previousData,
  })
}

export function useContractor(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: computed(() => contractorKeys.detail(toValue(id) ?? '')),
    queryFn: () => {
      const contractorId = toValue(id)
      if (!contractorId) throw new Error('Contractor id is required')
      return contractorService.get(contractorId)
    },
    enabled: computed(() => !!toValue(id)),
  })
}
