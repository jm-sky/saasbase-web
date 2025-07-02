# Picker Components

A collection of small, focused, composable components for building picker/autocomplete interfaces.

## Philosophy

Instead of one large monolithic component, we've broken down the picker functionality into smaller, single-responsibility components that are easier to understand, test, and maintain.

## Components

### `PickerPopover`
Handles the popover trigger button and wrapper.

### `PickerContent` 
Handles the Command wrapper, search input, and error display.

### `PickerList`
Handles the scrollable list with infinite scroll, empty states, and loading indicators.

### `PickerActions`
Handles the footer actions (clear cache, create button).

### `PickerItem`
Handles individual item rendering with consistent styling.

## Usage Example

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { CommandGroup } from '@/components/ui/command'
import {
  PickerPopover,
  PickerContent,
  PickerList,
  PickerActions,
  PickerItem
} from '@/components/Pickers'

// Your picker logic here
const open = ref(false)
const search = ref('')
const selectedItem = ref()
const items = ref([])
const loading = ref(false)
const error = ref(null)

const groupedItems = computed(() => ({
  recent: [],
  others: items.value
}))
</script>

<template>
  <PickerPopover
    v-model:open="open"
    :model-value="selectedItem"
    :loading="loading"
    placeholder="Select item..."
  >
    <PickerContent
      v-model:search="search"
      :error="error"
      @search-input="onSearchDebounced"
    >
      <PickerList
        :loading="loading"
        :has-more-data="hasMoreData"
        :show-create-button="true"
        @create="handleCreate"
      >
        <!-- Recent items -->
        <CommandGroup v-if="groupedItems.recent.length > 0" heading="Recent">
          <PickerItem
            v-for="item in groupedItems.recent"
            :key="`recent-${item.id}`"
            :value="item.id"
            :is-selected="selectedItem?.id === item.id"
            :is-loading="loading"
            @select="onSelect"
          >
            <div class="text-sm font-medium truncate">{{ item.name }}</div>
          </PickerItem>
        </CommandGroup>

        <!-- All items -->
        <CommandGroup heading="All Items">
          <PickerItem
            v-for="item in groupedItems.others"
            :key="item.id"
            :value="item.id"
            :is-selected="selectedItem?.id === item.id"
            :is-loading="loading"
            @select="onSelect"
          >
            <div class="text-sm truncate">{{ item.name }}</div>
            <div class="text-xs text-muted-foreground">{{ item.description }}</div>
          </PickerItem>
        </CommandGroup>
      </PickerList>

      <PickerActions
        :show-create-button="true"
        @clear-cache="clearCache"
        @create="handleCreate"
      />
    </PickerContent>
  </PickerPopover>
</template>
```

## Benefits

✅ **Single Responsibility**: Each component has one clear purpose  
✅ **Easy to Test**: Smaller components are easier to unit test  
✅ **Flexible Composition**: Mix and match components as needed  
✅ **Easy to Understand**: Less code per component, clearer intent  
✅ **Maintainable**: Changes are isolated to specific components  
✅ **Reusable**: Components can be used in different combinations  

## Creating Custom Pickers

1. **Simple Picker**: Use all components together
2. **Custom Layout**: Rearrange components as needed
3. **Specialized Picker**: Replace specific components with custom ones
4. **Minimal Picker**: Use only the components you need

## Migration from Monolithic BasePicker

If you have an existing large picker component, you can gradually migrate by:

1. Extract the popover logic → `PickerPopover`
2. Extract search logic → `PickerContent`  
3. Extract list logic → `PickerList`
4. Extract actions → `PickerActions`
5. Standardize items → `PickerItem`

## Real-World Examples

### ContractorPicker
Located in `src/domains/contractor/components/ContractorPicker.vue` - demonstrates:
- Type filtering (supplier/buyer)
- Recent selections with localStorage
- VAT ID display
- Tag support
- Infinite scroll with caching

### ProductPicker
Located in `src/domains/product/components/ProductPicker.vue` - demonstrates:
- Type filtering (product/service)
- Price display with units
- Description support
- Tag support

```vue
<script setup lang="ts">
import { ProductPicker } from '@/domains/product/components'

const selectedProduct = ref<IProductLookup>()
</script>

<template>
  <ProductPicker
    v-model:model-value="selectedProduct"
    type="product"
    :show-create-button="true"
    :show-price="true"
    @create="createNewProduct"
  />
</template>
```

This composable approach makes creating new pickers fast and consistent! 🎉 
