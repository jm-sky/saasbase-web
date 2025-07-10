<template>
  <div class="border border-border rounded-lg overflow-hidden bg-background">
    <div class="flex justify-between items-center px-3 py-2 bg-muted border-b border-border gap-2">
      <div class="flex items-center gap-2">
        <select
          v-model="selectedTemplate"
          class="px-2 py-1 border border-border rounded text-xs bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          @change="loadTemplate"
        >
          <option value="">
            {{ t('tenant.invoiceTemplates.editor.chooseTemplate') }}
          </option>
          <option v-for="template in templates" :key="template.name" :value="template.name">
            {{ template.label }}
          </option>
        </select>
        <Button variant="outline" size="sm" @click="insertSnippet('variable')">
          📝 {{ t('tenant.invoiceTemplates.editor.variable') }}
        </Button>
        <Button variant="outline" size="sm" @click="insertSnippet('loop')">
          🔁 {{ t('tenant.invoiceTemplates.editor.loop') }}
        </Button>
        <Button variant="outline" size="sm" @click="insertSnippet('condition')">
          ❓ {{ t('tenant.invoiceTemplates.editor.condition') }}
        </Button>
        <Button variant="outline" size="sm" @click="formatCode">
          ✨ {{ t('tenant.invoiceTemplates.editor.format') }}
        </Button>
        <Button variant="outline" size="sm" @click="validateTemplate">
          🔍 {{ t('tenant.invoiceTemplates.editor.validate') }}
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="validationErrors.length > 0" class="text-xs text-destructive font-medium">
          {{ validationErrors.length }} {{ t('tenant.invoiceTemplates.editor.error', validationErrors.length) }}
        </span>
        <span v-else-if="hasValidated" class="text-xs text-green-600 font-medium">
          ✓ {{ t('tenant.invoiceTemplates.editor.valid') }}
        </span>
        <Button variant="outline" size="sm" @click="showHelp = !showHelp">
          ❓ {{ t('tenant.invoiceTemplates.editor.help') }}
        </Button>
      </div>
    </div>

    <div class="relative">
      <div ref="editorContainer" :style="{ height: height }" class="w-full" />
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

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { computed, nextTick, onMounted, onUnmounted, ref, type Ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'

const { t } = useI18n()

// Types
interface SchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date'
  description?: string
  properties?: Record<string, SchemaProperty>
  items?: SchemaProperty
  required?: boolean
}

type DataSchema = Record<string, SchemaProperty>;

interface InvoiceTemplate {
  name: string
  label: string
  content: string
}

interface HandlebarsHelper {
  name: string
  syntax: string
  description: string
}

interface ValidationError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning'
}

interface SchemaPath {
  path: string
  syntax: string
  description: string
  type: string
}

type SnippetType = 'variable' | 'loop' | 'condition'
type MonacoTheme = 'vs' | 'vs-dark' | 'hc-black'

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
  schema: () => ({
    invoice: {
      type: 'object',
      description: 'Main invoice data',
      properties: {
        id: { type: 'string', description: 'Invoice ID' },
        number: { type: 'string', description: 'Invoice number' },
        type: { type: 'string', description: 'Invoice type' },
        status: { type: 'string', description: 'Invoice status' },
        issueDate: { type: 'string', description: 'Invoice issue date' },
        dueDate: { type: 'string', description: 'Payment due date' },
        description: { type: 'string', description: 'Invoice description' },
        currency: { type: 'string', description: 'Currency code' },
        currencySymbol: { type: 'string', description: 'Currency symbol' },
        formattedTotalNet: { type: 'string', description: 'Formatted net total' },
        formattedTotalTax: { type: 'string', description: 'Formatted tax total' },
        formattedTotalGross: { type: 'string', description: 'Formatted gross total' },
        seller: {
          type: 'object',
          description: 'Seller information',
          properties: {
            name: { type: 'string', description: 'Company/seller name' },
            address: { type: 'string', description: 'Seller address' },
            country: { type: 'string', description: 'Seller country' },
            taxId: { type: 'string', description: 'Tax ID/VAT number' },
            email: { type: 'string', description: 'Seller email' },
            logoUrl: { type: 'string', description: 'Logo URL' }
          }
        },
        buyer: {
          type: 'object',
          description: 'Buyer information',
          properties: {
            name: { type: 'string', description: 'Buyer name' },
            address: { type: 'string', description: 'Buyer address' },
            country: { type: 'string', description: 'Buyer country' },
            taxId: { type: 'string', description: 'Buyer tax ID' },
            email: { type: 'string', description: 'Buyer email' }
          }
        },
        lines: {
          type: 'array',
          description: 'Invoice line items',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Line item ID' },
              description: { type: 'string', description: 'Item description' },
              formattedQuantity: { type: 'string', description: 'Formatted quantity' },
              formattedUnitPrice: { type: 'string', description: 'Formatted unit price' },
              formattedTotalNet: { type: 'string', description: 'Formatted net amount' },
              formattedTotalVat: { type: 'string', description: 'Formatted VAT amount' },
              formattedTotalGross: { type: 'string', description: 'Formatted gross amount' },
              vatRateName: { type: 'string', description: 'VAT rate name' },
              vatRateValue: { type: 'number', description: 'VAT rate percentage' }
            }
          }
        },
        vatSummary: {
          type: 'array',
          description: 'VAT summary by rate',
          items: {
            type: 'object',
            properties: {
              vatRateName: { type: 'string', description: 'VAT rate name' },
              vatRateValue: { type: 'number', description: 'VAT rate percentage' },
              formattedNet: { type: 'string', description: 'Formatted net amount' },
              formattedVat: { type: 'string', description: 'Formatted VAT amount' },
              formattedGross: { type: 'string', description: 'Formatted gross amount' }
            }
          }
        },
        payment: {
          type: 'object',
          description: 'Payment information',
          properties: {
            status: { type: 'string', description: 'Payment status' },
            method: { type: 'string', description: 'Payment method' },
            dueDate: { type: 'string', description: 'Payment due date' },
            terms: { type: 'string', description: 'Payment terms' },
            bankAccount: {
              type: 'object',
              description: 'Bank account details',
              properties: {
                iban: { type: 'string', description: 'IBAN number' },
                swift: { type: 'string', description: 'SWIFT code' },
                bankName: { type: 'string', description: 'Bank name' }
              }
            }
          }
        }
      }
    },
    options: {
      type: 'object',
      description: 'Template options',
      properties: {
        includeSignatures: { type: 'boolean', description: 'Include signature blocks' },
        issuerSignature: {
          type: 'object',
          description: 'Issuer signature information',
          properties: {
            name: { type: 'string', description: 'Signatory name' },
            title: { type: 'string', description: 'Signatory title' },
            date: { type: 'string', description: 'Signature date' },
            imageUrl: { type: 'string', description: 'Signature image URL' }
          }
        },
        receiverSignature: {
          type: 'object',
          description: 'Receiver signature information',
          properties: {
            name: { type: 'string', description: 'Signatory name' },
            title: { type: 'string', description: 'Signatory title' },
            date: { type: 'string', description: 'Signature date' },
            imageUrl: { type: 'string', description: 'Signature image URL' }
          }
        }
      }
    }
  })
})

// Emits
interface Emits {
  'update:modelValue': [value: string]
  'change': [value: string]
  'validation': [errors: ValidationError[]]
}

const emit = defineEmits<Emits>()

// Template refs
const editorContainer = ref<HTMLDivElement | null>(null)

// Reactive state
const editor: Ref<monaco.editor.IStandaloneCodeEditor | null> = ref(null)
const showHelp = ref<boolean>(false)
const selectedTemplate = ref<string>('')
const validationErrors = ref<ValidationError[]>([])
const hasValidated = ref<boolean>(false)

// Computed
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

// Templates data
const templates = ref<InvoiceTemplate[]>([
  {
    name: 'basic',
    label: t('tenant.invoiceTemplates.editor.basicInvoice'),
    content: `<!DOCTYPE html>
<html>
<head>
    <title>{{ t "invoices.title" }} #{{invoice.number}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .invoice-details { margin-bottom: 30px; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .total { text-align: right; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{invoice.seller.name}}</h1>
        <p>{{invoice.seller.address}}</p>
        <p>{{ t "invoices.email" }}: {{invoice.seller.email}}</p>
    </div>

    <div class="invoice-details">
        <h2>{{ t "invoices.invoice" }} #{{invoice.number}}</h2>
        <p><strong>{{ t "invoices.issueDate" }}:</strong> {{formatDate invoice.issueDate}}</p>
        <p><strong>{{ t "invoices.dueDate" }}:</strong> {{formatDate invoice.dueDate}}</p>

        <h3>{{ t "invoices.billTo" }}:</h3>
        <p>{{invoice.buyer.name}}</p>
        <p>{{invoice.buyer.address}}</p>
        <p>{{invoice.buyer.email}}</p>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>{{ t "invoices.description" }}</th>
                <th>{{ t "invoices.quantity" }}</th>
                <th>{{ t "invoices.unitPrice" }}</th>
                <th>{{ t "invoices.amount" }}</th>
            </tr>
        </thead>
        <tbody>
            {{#each invoice.lines}}
            <tr>
                <td>{{description}}</td>
                <td>{{formattedQuantity}}</td>
                <td>{{formattedUnitPrice}}</td>
                <td>{{formattedTotalNet}}</td>
            </tr>
            {{/each}}
        </tbody>
    </table>

    <div class="total">
        <p>{{ t "invoices.subtotal" }}: {{invoice.formattedTotalNet}}</p>
        <p>{{ t "invoices.tax" }}: {{invoice.formattedTotalTax}}</p>
        <h3>{{ t "invoices.total" }}: {{invoice.formattedTotalGross}}</h3>
    </div>
</body>
</html>`
  },
  {
    name: 'simple',
    label: t('tenant.invoiceTemplates.editor.simpleInvoice'),
    content: `{{ t "invoices.invoice" }} #{{invoice.number}}

{{invoice.seller.name}}
{{invoice.seller.address}}
{{ t "invoices.email" }}: {{invoice.seller.email}}

---

{{ t "invoices.billTo" }}:
{{invoice.buyer.name}}
{{invoice.buyer.address}}
{{invoice.buyer.email}}

{{ t "invoices.issueDate" }}: {{formatDate invoice.issueDate}}
{{ t "invoices.dueDate" }}: {{formatDate invoice.dueDate}}

---

{{ t "invoices.items" }}:
{{#each invoice.lines}}
{{description}} - {{ t "invoices.quantity" }}: {{formattedQuantity}} x {{formattedUnitPrice}} = {{formattedTotalNet}}
{{/each}}

---

{{ t "invoices.subtotal" }}: {{invoice.formattedTotalNet}}
{{ t "invoices.tax" }}: {{invoice.formattedTotalTax}}
{{ t "invoices.total" }}: {{invoice.formattedTotalGross}}`
  }
])

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

// Validation Methods
const validatePath = (path: string): boolean => {
  const pathParts = path.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = props.schema

  for (const part of pathParts) {
    if (part === '[]') continue // Skip array index placeholder

    if (typeof current === 'object' && current && 'properties' in current && current.properties) {
      current = current.properties[part]
    } else if (typeof current === 'object' && current?.[part]) {
      current = current[part]
    } else {
      return false
    }

    if (!current) return false

    // Handle array items
    if (current.type === 'array' && current.items) {
      current = current.items
    }
  }

  return true
}

const extractHandlebarsExpressions = (content: string): { expression: string, line: number, column: number }[] => {
  const expressions: { expression: string, line: number, column: number }[] = []
  const lines = content.split('\n')

  lines.forEach((line, lineIndex) => {
    // Match {{expression}} patterns
    const regex = /\{\{([^}]+)\}\}/g
    let match

    while ((match = regex.exec(line)) !== null) {
      const expression = match[1].trim()
      const column = match.index + 1

      expressions.push({
        expression,
        line: lineIndex + 1,
        column
      })
    }
  })

  return expressions
}

const validateTemplate = (): void => {
  if (!editor.value) return

  const content = editor.value.getValue()
  const expressions = extractHandlebarsExpressions(content)
  const errors: ValidationError[] = []

  expressions.forEach(({ expression, line, column }) => {
    // Skip helpers and block expressions
    if (expression.startsWith('#') || expression.startsWith('/') || expression.startsWith('!')) {
      return
    }

    // Extract just the path part for helpers with arguments
    const pathMatch = /^(\w+(?:\.\w+)*)/.exec(expression)
    if (!pathMatch) return

    const path = pathMatch[1]

    // Skip known helpers
    const knownHelpers = ['t', 'formatCurrency', 'formatDate', 'formatNumber', 'upper', 'lower', 'ifEquals', 'ifNotEmpty', 'logoUrl', 'signatureUrl', 'each', 'if', 'unless', 'with']
    if (knownHelpers.includes(path.split('.')[0]) || knownHelpers.includes(path.split(' ')[0])) {
      return
    }

    if (!validatePath(path)) {
      errors.push({
        line,
        column,
        message: t('tenant.invoiceTemplates.editor.propertyNotExist', { path }),
        severity: 'error'
      })
    }
  })

  validationErrors.value = errors
  hasValidated.value = true

  // Set Monaco markers for visual feedback
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (editor.value) {
    const markers: monaco.editor.IMarkerData[] = errors.map(error => ({
      startLineNumber: error.line,
      startColumn: error.column,
      endLineNumber: error.line,
      endColumn: error.column + 20, // Approximate end of expression
      message: error.message,
      severity: monaco.MarkerSeverity.Error
    }))

    const model = editor.value.getModel()
    if (model) {
      monaco.editor.setModelMarkers(model, 'handlebars-validation', markers)
    }
  }

  emit('validation', errors)
}

// Methods
const configureHandlebars = (): void => {
  // Register custom completion provider for schema paths
  monaco.languages.registerCompletionItemProvider('handlebars', {
    provideCompletionItems: (model, position) => {
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

const initMonaco = async (): Promise<void> => {
  await nextTick()

  if (!editorContainer.value) return

  // Configure Handlebars language
  configureHandlebars()

  // Create editor
  editor.value = monaco.editor.create(editorContainer.value, {
    value: props.modelValue || '',
    language: props.language,
    theme: props.theme,
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: 'on',
    lineNumbers: 'on',
    folding: true,
    suggest: {
      snippetsPreventQuickSuggestions: false
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    }
  })

  // Set up change listener with validation
  editor.value.onDidChangeModelContent(() => {
    if (!editor.value) return
    const value = editor.value.getValue()
    emit('update:modelValue', value)
    emit('change', value)

    // Auto-validate after a short delay
    setTimeout(() => { validateTemplate() }, 500)
  })

  // Initial validation
  void setTimeout(() => { validateTemplate() }, 1000)
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

const loadTemplate = (): void => {
  const template = templates.value.find(t => t.name === selectedTemplate.value)
  if (template && editor.value) {
    editor.value.setValue(template.content)
    selectedTemplate.value = ''
  }
}

// Watchers
watch(() => props.modelValue, (newValue: string) => {
  if (editor.value && editor.value.getValue() !== newValue) {
    editor.value.setValue(newValue || '')
  }
})

watch(() => props.theme, (newTheme: MonacoTheme) => {
  if (editor.value) {
    monaco.editor.setTheme(newTheme)
  }
})

watch(() => props.schema, () => {
  // Re-validate when schema changes
  void setTimeout(() => { validateTemplate() }, 100)
}, { deep: true })

// Lifecycle
onMounted(() => {
  void initMonaco()
})

onUnmounted(() => {
  if (editor.value) {
    editor.value.dispose()
  }
})
</script>