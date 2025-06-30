import { defineStore } from 'pinia'
import { ref } from 'vue'
import { config } from '@/config'
import type { IExchangeRate, IExchangeRateFilters } from '../types/exchange-rate.type'

const STORAGE_KEY = `${config.appId}:exchange-rates-cache`
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

interface CachedData {
  rates: IExchangeRate[]
  timestamp: number
  filters: IExchangeRateFilters
}

const getFromStorage = (filters: IExchangeRateFilters): IExchangeRate[] | null => {
  try {
    const cached = sessionStorage.getItem(STORAGE_KEY)
    if (!cached) return null

    const data: CachedData = JSON.parse(cached)
    const now = Date.now()

    // Check if cache is expired
    if (now - data.timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }

    // Check if filters match (simplified comparison for date)
    const currentDate = filters.filter?.date?.value
    const cachedDate = data.filters.filter?.date?.value
    if (currentDate && cachedDate && currentDate === cachedDate) {
      return data.rates
    }

    return null
  } catch {
    return null
  }
}

const saveToStorage = (rates: IExchangeRate[], filters: IExchangeRateFilters) => {
  try {
    const data: CachedData = {
      rates,
      timestamp: Date.now(),
      filters,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage might be full or disabled, ignore
  }
}

export const useExchangeRateStore = defineStore('exchangeRate', () => {
  const rates = ref<IExchangeRate[]>([])
  const loading = ref(false)

  const setRates = (newRates: IExchangeRate[]) => {
    rates.value = newRates
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const loadFromCache = (filters: IExchangeRateFilters): boolean => {
    const cachedRates = getFromStorage(filters)
    if (cachedRates) {
      rates.value = cachedRates
      return true
    }
    return false
  }

  const saveToCache = (filters: IExchangeRateFilters) => {
    saveToStorage(rates.value, filters)
  }

  const clearCache = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    rates.value = []
  }

  return {
    rates,
    loading,
    setRates,
    setLoading,
    loadFromCache,
    saveToCache,
    clearCache,
  }
})
