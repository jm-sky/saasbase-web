import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { projectService } from '../services/ProjectService'
import { projectKeys } from './queryKeys'
import type { IProject, IProjectCreatePayload } from '../types/project.type'

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IProjectCreatePayload) => projectService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<IProject> }) => projectService.update(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}
