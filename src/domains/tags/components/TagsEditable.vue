<script setup lang="ts">
import { Palette, PlusIcon } from 'lucide-vue-next'
import { useFilter } from 'reka-ui'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import Popover from '@/components/ui/popover/Popover.vue'
import PopoverContent from '@/components/ui/popover/PopoverContent.vue'
import PopoverTrigger from '@/components/ui/popover/PopoverTrigger.vue'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { useToast } from '@/components/ui/toast'
import type { IModelTagService, ITagPreview, TTagColor } from '../types/tag.type'
import { useTags } from '../composables/useTags'
import { tagColor } from '../utils/tagColor'
import TagsColorList from './TagsColorList.vue'

const { t } = useI18n()
const { toast } = useToast()

const { isLoading, availableTags, loadTags, createTag } = useTags()

const modelValue = defineModel<ITagPreview[]>('modelValue', {required: true})

const props = defineProps<{
  modelId?: string
  tagService?: IModelTagService
}>()

const open = ref(false)
const loading = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredOptions = computed(() => {
  const options = availableTags.value.filter(i => !modelValue.value.some(t => t.name === i.name))
  return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options
})

const addTag = async (tag: string, color?: TTagColor) => {
  if (!props.modelId) return
  if (!props.tagService) return

  try {
    loading.value = true
    await props.tagService.create(props.modelId, tag)
    modelValue.value.push({ name: tag, color: color ?? 'default' })
  } catch (error) {
    console.error(error)
    toast.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const addGlobalTag = async (tag: string, color?: TTagColor, close?: boolean) => {
  try {
    loading.value = true
    await createTag(tag, color)
    await addTag(tag, color)
    searchTerm.value = ''
    if (close) open.value = false
  } catch (error) {
    console.error(error)
    toast.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const removeTag = async (tag: string) => {
  if (!props.modelId) return
  if (!props.tagService) return

  try {
    loading.value = true
    await props.tagService.delete(props.modelId, tag)
    modelValue.value = modelValue.value.filter(t => t.name !== tag)
  } catch (error) {
    console.error(error)
    toast.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const handleTagSelect = async (option: ITagPreview) => {
  searchTerm.value = ''
  await addTag(option.name, option.color)
  open.value = false
}

onMounted(async () => {
  await loadTags()
})
</script>

<template>
  <Combobox v-model="modelValue" v-model:open="open" :ignore-filter="true">
    <ComboboxAnchor as-child>
      <TagsInput v-model="modelValue" class="px-2 gap-2 w-full" :class="{ 'opacity-50': loading }">
        <div class="flex gap-2 flex-wrap items-center">
          <TagsInputItem
            v-for="item in modelValue"
            :key="item.name"
            :value="item.name"
            :class="tagColor(item.color ?? 'default')"
          >
            <TagsInputItemText />
            <TagsInputItemDelete @click="removeTag(item.name)" />
          </TagsInputItem>
          <ComboboxInput v-model="searchTerm" as-child>
            <TagsInputInput
              placeholder="Tag..."
              class="min-w-20 p-0 border-none focus-visible:ring-0 h-auto"
              @keydown.enter.prevent
              @focus="open = true"
            />
          </ComboboxInput>
        </div>
      </TagsInput>

      <ComboboxList class="min-w-25 w-[--reka-popper-anchor-width]">
        <ComboboxEmpty class="py-4 flex flex-col gap-2">
          {{ t('common.noItems') }}
          <div v-if="searchTerm" class="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              :loading="isLoading"
              @click="addGlobalTag(searchTerm)"
            >
              <PlusIcon class="size-4" />
              {{ t('common.add') }}
              "{{ searchTerm }}"
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button variant="outline" size="sm">
                  <Palette class="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <TagsColorList :text="searchTerm" @select="addGlobalTag(searchTerm, $event, true)" />
              </PopoverContent>
            </Popover>
          </div>
        </ComboboxEmpty>

        <ComboboxGroup v-if="filteredOptions.length > 0" class="flex flex-col gap-0.5">
          <ComboboxItem
            v-for="option in filteredOptions"
            :key="option.slug"
            :value="option.name"
            class="p-0 cursor-pointer hover:opacity-90"
            @select.prevent="handleTagSelect(option)"
          >
            <div :class="tagColor(option.color ?? 'default')" class="w-full h-full rounded px-2 py-1.5 text-sm">
              {{ option.name }}
            </div>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
</template>
