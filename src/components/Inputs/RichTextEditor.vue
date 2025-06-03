<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

const modelValue = defineModel<string>()

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      bulletList: false,
      orderedList: false,
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
  content: modelValue.value ?? '<p></p>',
  onUpdate: ({ editor }) => {
    modelValue.value = editor.getHTML()
  },
})

watch(modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue ?? '<p></p>')
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
    <div class="flex gap-1 flex-wrap items-center p-2 border-b bg-gray-50">
      <button
        class="px-2 py-1 text-sm rounded hover:bg-gray-200"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'bg-gray-300': editor?.isActive('bold') }"
      >
        Bold
      </button>
      <button
        class="px-2 py-1 text-sm rounded hover:bg-gray-200"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'bg-gray-300': editor?.isActive('italic') }"
      >
        Italic
      </button>
      <button
        class="px-2 py-1 text-sm rounded hover:bg-gray-200"
        @click="editor?.chain().focus().toggleUnderline().run()"
        :class="{ 'bg-gray-300': editor?.isActive('underline') }"
      >
        Underline
      </button>
      <button
        class="px-2 py-1 text-sm rounded hover:bg-gray-200"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-gray-300': editor?.isActive('bulletList') }"
      >
        • List
      </button>
      <button
        class="px-2 py-1 text-sm rounded hover:bg-gray-200"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-gray-300': editor?.isActive('orderedList') }"
      >
        1. List
      </button>
      <button
        class="px-2 py-1 text-sm rounded hover:bg-gray-200"
        @click="setLink"
        :disabled="!editor"
      >
        Link
      </button>
    </div>

    <!-- Editor -->
    <div class="prose max-w-none wysiwyg p-4">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>