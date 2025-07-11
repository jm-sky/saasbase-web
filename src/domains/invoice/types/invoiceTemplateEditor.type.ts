// Types
export interface SchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date'
  description?: string
  properties?: Record<string, SchemaProperty>
  items?: SchemaProperty
  required?: boolean
}

export type DataSchema = Record<string, SchemaProperty>;

export interface HandlebarsHelper {
  name: string
  syntax: string
  description: string
}

export interface ValidationError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning'
}

export interface SchemaPath {
  path: string
  syntax: string
  description: string
  type: string
}

export type SnippetType = 'variable' | 'loop' | 'condition'
export type MonacoTheme = 'vs' | 'vs-dark' | 'hc-black'
