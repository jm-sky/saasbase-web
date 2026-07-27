import type { IContractorFilters } from '../services/ContractorService'

export const contractorKeys = {
  all: ['contractors'] as const,
  lists: () => [...contractorKeys.all, 'list'] as const,
  list: (filters?: IContractorFilters) => [...contractorKeys.lists(), filters] as const,
  details: () => [...contractorKeys.all, 'detail'] as const,
  detail: (id: string) => [...contractorKeys.details(), id] as const,
}
