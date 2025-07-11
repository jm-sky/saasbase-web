import type { DataSchema } from '../types/invoiceTemplateEditor.type'

export const useValidatePath = (schema: DataSchema) => {
  const validatePath = (path: string): boolean => {
    const pathParts = path.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = schema

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

  return {
    validatePath
  }
}
