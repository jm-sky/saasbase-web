<script setup lang="ts">
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { MoreVertical } from 'lucide-vue-next'
import TurndownService from 'turndown'
import { onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'

const { t } = useI18n()
const turndownService = new TurndownService()

const modelValue = defineModel<string>({ required: true })

const emit = defineEmits<{
  'update:markdown': [markdown: string]
}>()

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      bulletList: false,
      orderedList: false,
      bold: false,
      italic: false,
      listItem: false,
    }),
    Bold,
    Italic,
    Underline,
    Link.configure({
      openOnClick: false,
    }),
    BulletList,
    OrderedList,
    ListItem,
  ],
  content: modelValue.value,
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    const markdown = turndownService.turndown(html)
    modelValue.value = html
    emit('update:markdown', markdown)
  },
})

watch(modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

function setLink() {
  const url = window.prompt('Wprowadź URL')
  if (url && editor.value) {
    editor.value.commands.setLink({ href: url })
  }
}
</script>

<template>
  <div class="border rounded-lg overflow-hidden">
    <!-- Toolbar -->
    <div class="flex gap-1 flex-wrap items-center p-2 border-b bg-gray-50 dark:bg-gray-900">
      <button
        v-tooltip.bottom="t('components.textEditor.bold')"
        type="button"
        class="size-6 flex items-center justify-center text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        :class="{ 'bg-gray-300': editor?.isActive('bold') }"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        B
      </button>
      <button
        v-tooltip.bottom="t('components.textEditor.italic')"
        type="button"
        class="size-6 flex items-center justify-center text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        :class="{ 'bg-gray-300': editor?.isActive('italic') }"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        I
      </button>
      <button
        v-tooltip.bottom="t('components.textEditor.underline')"
        type="button"
        class="size-6 flex items-center justify-center text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        :class="{ 'bg-gray-300': editor?.isActive('underline') }"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        U
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="size-6 flex items-center justify-center text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <MoreVertical class="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="space-y-1">
          <DropdownMenuItem
            v-tooltip.bottom="t('components.textEditor.bulletList')"
            class="cursor-pointer"
            @click="editor?.chain().focus().toggleBulletList().run()"
          >
            • List
          </DropdownMenuItem>
          <DropdownMenuItem
            v-tooltip.bottom="t('components.textEditor.orderedList')"
            class="cursor-pointer"
            @click="editor?.chain().focus().toggleOrderedList().run()"
          >
            1. List
          </DropdownMenuItem>
          <DropdownMenuItem
            v-tooltip.bottom="t('components.textEditor.link')"
            class="cursor-pointer"
            :disabled="!editor"
            @click="setLink"
          >
            Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Editor -->
    <div class="prose max-w-none wysiwyg p-4">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>