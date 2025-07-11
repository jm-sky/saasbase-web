<script setup lang="ts">
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import * as monaco from 'monaco-editor'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import type { DataSchema, HandlebarsHelper, MonacoTheme, SchemaPath, SchemaProperty, SnippetType, ValidationError } from '../../types/invoiceTemplateEditor.type'
import { getInvoiceTemplateSchema } from '../../helpers/invoiceTemplateSchema'

const { t } = useI18n()

// Props
interface Props {
  modelValue?: string
  language?: string
  theme?: MonacoTheme
  height?: string
  schema?: DataSchema
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  language: 'handlebars',
  theme: 'vs',
  height: '400px',
  schema: () => getInvoiceTemplateSchema()
})

// Emits
interface Emits {
  'update:modelValue': [value: string]
  'change': [value: string]
  'validation': [errors: ValidationError[]]
}

const emit = defineEmits<Emits>()

// Reactive state
const internalValue = ref(props.modelValue)
const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
const showHelp = ref(false)
const validationErrors = ref<ValidationError[]>([])
const hasValidated = ref(false)

// Editor options
const editorOptions = computed(() => ({
  automaticLayout: true,
  minimap: { enabled: false },
  wordWrap: 'on' as const,
  lineNumbers: 'on' as const,
  folding: true,
  suggest: {
    snippetsPreventQuickSuggestions: false
  },
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true
  }
}))

// Computed schema paths
const schemaPaths = computed<SchemaPath[]>(() => {
  const paths: SchemaPath[] = []

  const extractPaths = (schema: DataSchema | Record<string, SchemaProperty>, prefix = ''): void => {
    Object.entries(schema).forEach(([key, prop]) => {
      const path = prefix ? `${prefix}.${key}` : key
      const syntax = `{{${path}}}`

      paths.push({
        path,
        syntax,
        description: prop.description ?? `${prop.type} value`,
        type: prop.type
      })

      if (prop.type === 'object' && prop.properties) {
        extractPaths(prop.properties, path)
      } else if (prop.type === 'array' && prop.items?.type === 'object' && prop.items.properties) {
        extractPaths(prop.items.properties, `${path}.[]`)
      }
    })
  }

  extractPaths(props.schema)
  return paths
})

// Handlebars helpers
const helpers = ref<HandlebarsHelper[]>([
  { name: 't', syntax: '{{t "invoices.key"}}', description: t('tenant.invoiceTemplates.editor.translationHelper') },
  { name: 'formatCurrency', syntax: '{{formatCurrency amount "PLN"}}', description: t('tenant.invoiceTemplates.editor.formatCurrency') },
  { name: 'formatDate', syntax: '{{formatDate date "Y-m-d"}}', description: t('tenant.invoiceTemplates.editor.formatDate') },
  { name: 'formatNumber', syntax: '{{formatNumber number 2}}', description: t('tenant.invoiceTemplates.editor.formatNumber') },
  { name: 'upper', syntax: '{{upper text}}', description: t('tenant.invoiceTemplates.editor.upperCase') },
  { name: 'lower', syntax: '{{lower text}}', description: t('tenant.invoiceTemplates.editor.lowerCase') },
  { name: 'ifEquals', syntax: '{{#ifEquals value1 value2}}...{{/ifEquals}}', description: t('tenant.invoiceTemplates.editor.ifEquals') },
  { name: 'ifNotEmpty', syntax: '{{#ifNotEmpty value}}...{{/ifNotEmpty}}', description: t('tenant.invoiceTemplates.editor.ifNotEmpty') },
  { name: 'logoUrl', syntax: '{{{logoUrl url width="140px"}}}', description: t('tenant.invoiceTemplates.editor.logoUrl') },
  { name: 'signatureUrl', syntax: '{{{signatureUrl url}}}', description: t('tenant.invoiceTemplates.editor.signatureUrl') },
  { name: 'each', syntax: '{{#each items}}...{{/each}}', description: t('tenant.invoiceTemplates.editor.each') },
  { name: 'if', syntax: '{{#if condition}}...{{/if}}', description: t('tenant.invoiceTemplates.editor.if') },
  { name: 'unless', syntax: '{{#unless condition}}...{{/unless}}', description: t('tenant.invoiceTemplates.editor.unless') }
])

// Methods
const handleEditorMount = (editorInstance: monaco.editor.IStandaloneCodeEditor) => {
  editor.value = editorInstance

  // Configure autocompletion
  monaco.languages.registerCompletionItemProvider('handlebars', {
    provideCompletionItems: (_, position) => {
      const suggestions: monaco.languages.CompletionItem[] = []

      // Add schema paths
      schemaPaths.value.forEach(path => {
        suggestions.push({
          label: path.path,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: path.syntax,
          documentation: `${path.description} (${path.type})`,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          }
        })
      })

      // Add helpers
      helpers.value.forEach(helper => {
        suggestions.push({
          label: helper.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: helper.syntax,
          documentation: helper.description,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          }
        })
      })

      return { suggestions }
    }
  })
}

const handleEditorChange = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const insertSnippet = (type: SnippetType): void => {
  if (!editor.value) return

  const snippets: Record<SnippetType, string> = {
    variable: '{{invoice.}}',
    loop: '{{#each invoice.lines}}\n  <tr>\n    <td>{{description}}</td>\n    <td>{{formattedQuantity}}</td>\n  </tr>\n{{/each}}',
    condition: '{{#if invoice.seller.logoUrl}}\n  {{{logoUrl invoice.seller.logoUrl width="140px"}}}\n{{/if}}'
  }

  const position = editor.value.getPosition()
  if (!position) return

  editor.value.executeEdits('', [{
    range: {
      startLineNumber: position.lineNumber,
      startColumn: position.column,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    },
    text: snippets[type] || ''
  }])

  editor.value.focus()
}

const formatCode = (): void => {
  if (editor.value) {
    void editor.value.getAction('editor.action.formatDocument')?.run()
  }
}

const validateTemplate = (): void => {
  if (!editor.value) return

  const content = editor.value.getValue()
  const errors: ValidationError[] = []

  // Simple validation - just check for basic handlebars syntax
  const lines = content.split('\n')
  lines.forEach((line, lineIndex) => {
    const regex = /\{\{([^}]+)\}\}/g
    let match

    while ((match = regex.exec(line)) !== null) {
      const expression = match[1].trim()

      // Check for unmatched braces
      if (expression.includes('{') || expression.includes('}')) {
        errors.push({
          line: lineIndex + 1,
          column: match.index + 1,
          message: 'Unmatched braces in expression',
          severity: 'error'
        })
      }
    }
  })

  validationErrors.value = errors
  hasValidated.value = true

  // Set Monaco markers
  const markers: monaco.editor.IMarkerData[] = errors.map(error => ({
    startLineNumber: error.line,
    startColumn: error.column,
    endLineNumber: error.line,
    endColumn: error.column + 20,
    message: error.message,
    severity: monaco.MarkerSeverity.Error
  }))

  const model = editor.value.getModel()
  if (model) {
    monaco.editor.setModelMarkers(model, 'handlebars-validation', markers)
  }

  emit('validation', errors)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue
  }
})

watch(() => props.theme, (newTheme) => {
  if (editor.value) {
    monaco.editor.setTheme(newTheme)
  }
})
</script>

<template>
  <div class="border border-border rounded-lg overflow-hidden bg-background">
    <div class="flex justify-between items-center px-3 py-2 bg-muted border-b border-border gap-2">
      <div class="flex items-center gap-2">
        <Button
          disabled
          variant="light"
          size="sm"
          @click="insertSnippet('variable')"
        >
          📝 {{ t('tenant.invoiceTemplates.editor.variable') }}
        </Button>
        <Button
          disabled
          variant="light"
          size="sm"
          @click="insertSnippet('loop')"
        >
          🔁 {{ t('tenant.invoiceTemplates.editor.loop') }}
        </Button>
        <Button
          disabled
          variant="light"
          size="sm"
          @click="insertSnippet('condition')"
        >
          ❓ {{ t('tenant.invoiceTemplates.editor.condition') }}
        </Button>
        <Button
          disabled
          variant="light"
          size="sm"
          @click="formatCode"
        >
          ✨ {{ t('tenant.invoiceTemplates.editor.format') }}
        </Button>
        <Button
          disabled
          variant="light"
          size="sm"
          @click="validateTemplate"
        >
          🔍 {{ t('tenant.invoiceTemplates.editor.validate') }}
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="validationErrors.length > 0" class="text-xs text-destructive font-medium">
          {{ validationErrors.length }} {{ t('tenant.invoiceTemplates.editor.error', validationErrors.length) }}
        </span>
        <span v-else-if="hasValidated" class="text-xs text-success font-medium">
          ✓ {{ t('tenant.invoiceTemplates.editor.valid') }}
        </span>
        <Button
          disabled
          variant="light"
          size="sm"
          @click="showHelp = !showHelp"
        >
          ❓ {{ t('tenant.invoiceTemplates.editor.help') }}
        </Button>
      </div>
    </div>

    <div class="relative">
      <VueMonacoEditor
        v-model:value="internalValue"
        :language="language"
        :theme="theme"
        :height="height"
        :options="editorOptions"
        @mount="handleEditorMount"
        @change="handleEditorChange"
      />
    </div>

    <!-- Validation Errors Panel -->
    <div v-if="validationErrors.length > 0" class="border-t border-destructive/20 bg-destructive/10 p-3">
      <h4 class="text-sm font-semibold text-destructive mb-2">
        {{ t('tenant.invoiceTemplates.editor.templateErrors') }}:
      </h4>
      <div class="space-y-1">
        <div
          v-for="error in validationErrors"
          :key="`${error.line}-${error.column}`"
          class="text-xs text-destructive flex items-center gap-2"
        >
          <span class="bg-destructive/20 px-1.5 py-0.5 rounded font-mono">
            {{ t('tenant.invoiceTemplates.editor.line') }} {{ error.line }}:{{ error.column }}
          </span>
          <span>{{ error.message }}</span>
        </div>
      </div>
    </div>

    <!-- Help panel -->
    <div v-if="showHelp" class="p-4 bg-muted border-t border-border max-h-80 overflow-y-auto">
      <div class="mb-5">
        <h4 class="mb-3 text-sm font-semibold text-foreground">
          {{ t('tenant.invoiceTemplates.editor.availablePaths') }}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div v-for="path in schemaPaths" :key="path.path" class="flex items-center gap-3 py-1.5">
            <code class="bg-muted-foreground/20 px-1.5 py-0.5 rounded text-xs font-mono min-w-40 text-muted-foreground">
              {{ path.syntax }}
            </code>
            <span class="text-xs text-muted-foreground">{{ path.description }} ({{ path.type }})</span>
          </div>
        </div>
      </div>

      <div>
        <h4 class="mb-3 text-sm font-semibold text-foreground">
          {{ t('tenant.invoiceTemplates.editor.handlebarsHelpers') }}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div v-for="helper in helpers" :key="helper.name" class="flex items-center gap-3 py-1.5">
            <code class="bg-muted-foreground/20 px-1.5 py-0.5 rounded text-xs font-mono min-w-40 text-muted-foreground">
              {{ helper.syntax }}
            </code>
            <span class="text-xs text-muted-foreground">{{ helper.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
