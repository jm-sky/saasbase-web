import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { config } from '@/config'
import type { ICurrency } from '../types/currency.type'

export const useCurrencyStore = defineStore('currency', () => {
  const currencies = useSessionStorage<ICurrency[]>(`${config.appId}:currencies`, [], { serializer: StorageSerializers.object })

  return {
    currencies,
  }
})
