import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast'
import { TagService } from '../services/tag.service'
import { useTagStore } from '../stores/tag.store'

export const useTags = () => {
  const { toast } = useToast()
  const store = useTagStore()
  const { availableTags } = storeToRefs(store)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadTags = async () => {
    try {
      isLoading.value = true
      error.value = null
      const tags = await TagService.index()
      store.setTags(tags)
    } catch (e) {
      error.value = 'Failed to load tags'
      toast.error('Failed to load tags')
      console.error('Error loading tags:', e)
    } finally {
      isLoading.value = false
    }
  }

  const createTag = async (tag: string) => {
    try {
      error.value = null
      const response = await TagService.create(tag)
      store.addTag(response)
    } catch (e) {
      error.value = 'Failed to create tag'
      toast.error('Failed to create tag')
      console.error('Error creating tag:', e)
      throw e
    }
  }

  const deleteTag = async (tag: string) => {
    try {
      error.value = null
      await TagService.delete(tag)
      store.removeTag(tag)
    } catch (e) {
      error.value = 'Failed to delete tag'
      toast.error('Failed to delete tag')
      console.error('Error deleting tag:', e)
      throw e
    }
  }

  return {
    availableTags,
    isLoading,
    error,
    loadTags,
    createTag,
    deleteTag
  }
}
