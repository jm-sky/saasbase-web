import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { taskService, type ITaskFilters } from '../services/taskService'
import { taskKeys } from './queryKeys'

export function useTaskList(filters: MaybeRefOrGetter<ITaskFilters>) {
  return useQuery({
    queryKey: computed(() => taskKeys.list(toValue(filters))),
    queryFn: () => taskService.index(toValue(filters)),
    placeholderData: previousData => previousData,
  })
}
