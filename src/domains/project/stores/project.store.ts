import { useRouteParams } from '@vueuse/router'
import { defineStore } from 'pinia'
import { ref, type Ref, watch } from 'vue'
import type { IProject } from '../types/project.type'

export const useProjectStore = defineStore('project', () => {
  const project: Ref<IProject | null> = ref(null)
  const projects: Ref<IProject[]> = ref([])

  const routeId = useRouteParams<string | undefined>('id')

  const setProject = (projectData: IProject) => project.value = projectData

  watch(routeId, (id: string | undefined) => {
    if (id && id !== project.value?.id) {
      project.value = null
    }
  },{
    flush: 'pre',
  })

  return {
    project,
    projects,
    setProject,
  }
})