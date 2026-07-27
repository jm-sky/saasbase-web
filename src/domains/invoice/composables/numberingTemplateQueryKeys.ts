export const numberingTemplateKeys = {
  all: ['numbering-templates'] as const,
  lists: () => [...numberingTemplateKeys.all, 'list'] as const,
  list: (tenantId?: string | null) => [...numberingTemplateKeys.lists(), tenantId] as const,
  details: () => [...numberingTemplateKeys.all, 'detail'] as const,
  detail: (id: string) => [...numberingTemplateKeys.details(), id] as const,
}
