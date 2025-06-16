import { LRUCache } from 'lru-cache'
import { ref } from 'vue'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export interface CacheEntry<T> {
  items: T[]
  timestamp: number
}

const baseArrayEqual = (a: unknown[], b: unknown[]): boolean => {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

export interface CacheOptions<TFilters extends object, TModel extends object> {
  softRefreshInterval: number
  loadItems: (filters: TFilters) => Promise<IResourceCollection<TModel>>
  showResults: (items: TModel[]) => void
  areArraysEqual?: (a: TModel[], b: TModel[]) => boolean
}

export const useCache = <TFilters extends object, TModel extends object>({
  softRefreshInterval = 5 * 60 * 1000, // 5 minut
  loadItems,
  showResults,
  areArraysEqual = baseArrayEqual,
}: CacheOptions<TFilters, TModel>) => {
  const loading = ref(false)

  const cache = new LRUCache<TFilters, CacheEntry<TModel>>({
    max: 100, // max 100 fraz w cache
    ttl: 10 * 60 * 1000, // 10 minut TTL
  })

  const searchWithCache = async(filters: TFilters, forceFetch = false): Promise<TModel[]> => {
    const now = Date.now()
    const cached = cache.get(filters)

    if (cached && !forceFetch) {
      // Wyświetl od razu dane z cache
      showResults(cached.items)

      // Soft refetch, jeśli dane starsze niż 1 minuta
      if (now - cached.timestamp > softRefreshInterval) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        loadItems(filters).then(result => {
          if (!areArraysEqual(cached.items, result.data)) {
            cache.set(filters, { items: result.data, timestamp: Date.now() })
            showResults(result.data)
          }
        })
      }
      return cached.items
    }

    // Brak cache lub wymuszony fetch
    try {
      loading.value = true
      const freshItems: TModel[] = (await loadItems(filters)).data
      // Cache'ujemy tylko, jeśli nie pusty wynik
      if (freshItems.length > 0) {
        cache.set(filters, { items: freshItems, timestamp: now })
      }
      showResults(freshItems)
      return freshItems
    } catch (err) {
      console.error('[useCache][loadItems] error:', err)
    } finally {
      loading.value = false
    }

    return []
  }

  const clearCache = () => {
    cache.clear()
  }

  return {
    loading,
    searchWithCache,
    clearCache,
  }
}

export const cache = new LRUCache<object, CacheEntry<unknown>>({
  max: 100, // max 100 fraz w cache
  ttl: 10 * 60 * 1000, // 10 minut TTL
})
