<script setup lang="ts">
import { useFilter } from 'reka-ui'
import { computed, ref } from 'vue'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { useTags } from '../composables/useTags'
  
const { availableTags } = useTags()

const modelValue = defineModel<string[]>('modelValue', {required: true})
const open = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })
  
const filteredOptions = computed(() => {
  const options = availableTags.filter(i => !modelValue.value.includes(i.label))
  return searchTerm.value ? options.filter(option => contains(option.label, searchTerm.value)) : options
})
</script>

<template>
  <Combobox v-model="modelValue" v-model:open="open" :ignore-filter="true">
    <ComboboxAnchor as-child>
      <TagsInput v-model="modelValue" class="px-2 gap-2 w-80">
        <div class="flex gap-2 flex-wrap items-center">
          <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
        </div>

        <ComboboxInput v-model="searchTerm" as-child>
          <TagsInputInput placeholder="Tag..." class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto" @keydown.enter.prevent />
        </ComboboxInput>
      </TagsInput>

      <ComboboxList class="w-[--reka-popper-anchor-width]">
        <ComboboxEmpty />
        <ComboboxGroup>
          <ComboboxItem
            v-for="option in filteredOptions" :key="option.value" :value="option.label"
            @select.prevent="(ev) => {

              if (typeof ev.detail.value === 'string') {
                searchTerm = ''
                modelValue.push(ev.detail.value)
              }

              if (filteredOptions.length === 0) {
                open = false
              }
            }"
          >
            {{ option.label }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
</template>
