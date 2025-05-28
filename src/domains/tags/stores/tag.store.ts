import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ITag } from '../services/tag.service'

export const useTagStore = defineStore('tags', () => {
  const availableTags = ref<ITag[]>([])

  const setTags = (tags: ITag[]) => {
    availableTags.value = tags
  }

  const addTag = (tag: ITag) => {
    if (!availableTags.value.includes(tag)) {
      availableTags.value.push(tag)
    }
  }

  const removeTag = (tag: string) => {
    availableTags.value = availableTags.value.filter(t => t.name !== tag)
  }

  return {
    availableTags,
    setTags,
    addTag,
    removeTag
  }
})
