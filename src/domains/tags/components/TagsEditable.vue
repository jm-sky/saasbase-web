<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next'
import { useFilter } from 'reka-ui'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { useToast } from '@/components/ui/toast'
import type { IModelTagService } from '../types/tag.type'
import { useTags } from '../composables/useTags'

const { t } = useI18n()
const { toast } = useToast()

const { isLoading, availableTags, loadTags, createTag } = useTags()

const modelValue = defineModel<string[]>('modelValue', {required: true})

const props = defineProps<{
  modelId?: string
  tagService?: IModelTagService
}>()

const open = ref(false)
const loading = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredOptions = computed(() => {
  const options = availableTags.value.filter(i => !modelValue.value.includes(i.name))
  return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options
})

const addTag = async (tag: string) => {
  if (!props.modelId) return
  if (!props.tagService) return

  try {
    loading.value = true
    await props.tagService.create(props.modelId, tag)
    modelValue.value.push(tag)
  } catch (error) {
    console.error(error)
    toast.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const addGlobalTag = async (tag: string) => {
  try {
    loading.value = true
    await createTag(tag)
    await addTag(tag)
    searchTerm.value = ''
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
    modelValue.value = modelValue.value.filter(t => t !== tag)
  } catch (error) {
    console.error(error)
    toast.error(t('common.error'))
  } finally {
    loading.value = false
  }
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
          <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete @click="removeTag(item)" />
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

      <ComboboxList class="min-w-20 w-[--reka-popper-anchor-width]">
        <ComboboxEmpty class="py-4 flex flex-col gap-2">
          {{ t('common.noItems') }}
          <div class="flex flex-col gap-2">
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
          </div>
        </ComboboxEmpty>

        <ComboboxGroup v-if="filteredOptions.length > 0">
          <ComboboxItem
            v-for="option in filteredOptions"
            :key="option.slug"
            :value="option.name"
            @select.prevent="(ev) => {
              if (typeof ev.detail.value === 'string') {
                searchTerm = ''
                addTag(ev.detail.value)
              }

              if (filteredOptions.length === 0) {
                open = false
              }
            }"
          >
            {{ option.name }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
</template>
