import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { projectService, type IProjectFilters } from '../services/ProjectService'
import { projectKeys } from './queryKeys'

export function useProjectList(filters: MaybeRefOrGetter<IProjectFilters>) {
  return useQuery({
    queryKey: computed(() => projectKeys.list(toValue(filters))),
    queryFn: () => projectService.index(toValue(filters)),
    placeholderData: previousData => previousData,
  })
}

export function useProject(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: computed(() => projectKeys.detail(toValue(id) ?? '')),
    queryFn: () => {
      const projectId = toValue(id)
      if (!projectId) throw new Error('Project id is required')
      return projectService.get(projectId)
    },
    enabled: computed(() => !!toValue(id)),
  })
}
