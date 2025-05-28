import { useRouteParams } from '@vueuse/router'
import { defineStore } from 'pinia'
import { ref, type Ref, watch } from 'vue'
import type { IContractor, IContractorListItem } from '../types/contractor.type'

export const useContractorStore = defineStore('contractor', () => {
  const contractor: Ref<IContractor | null> = ref(null)
  const contractors: Ref<IContractor[]> = ref([])

  const routeId = useRouteParams<string | undefined>('id')

  const setContractor = (contractorData: IContractor | IContractorListItem) => contractor.value = contractorData

  watch(routeId, (id: string | undefined) => {
    if (id && id !== contractor.value?.id) {
      contractor.value = null
    }
  },{
    flush: 'pre',
  })

  return {
    contractor,
    contractors,
    setContractor,
  }
})