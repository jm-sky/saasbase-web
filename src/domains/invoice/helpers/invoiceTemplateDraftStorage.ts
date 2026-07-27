import { useI18n } from 'vue-i18n'
import type { IInvoiceTemplate } from '../types/invoiceTemplate.type'
import type { Ref } from 'vue'

export const useInvoiceTemplateDraftStorage = (
  draftId: Ref<string>,
  editableTemplate: Ref<IInvoiceTemplate>,
) => {
  const { t } = useI18n()

  const saveDraft = () => {
    if (!editableTemplate.value.content.trim()) return

    localStorage.setItem(draftId.value, JSON.stringify({
      ...editableTemplate.value,
      savedAt: new Date().toISOString()
    }))

    // Keep only last 5 drafts
    const drafts = Object.keys(localStorage)
      .filter(key => key.startsWith('template_draft_'))
      .sort()

    while (drafts.length > 5) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      localStorage.removeItem(drafts.shift()!)
    }
  }

  const loadDraft = () => {
    const drafts = Object.keys(localStorage)
      .filter(key => key.startsWith('template_draft_'))
      .sort()
      .reverse()

    if (drafts.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const latestDraft = JSON.parse(localStorage.getItem(drafts[0])!)
      return latestDraft
    }

    return null
  }

  const checkForUnsavedDraft = () => {
    const draft = loadDraft()
    if (!draft?.content.trim()) return

    const shouldLoad = confirm(t('tenant.invoiceTemplates.editor.loadUnsavedDraft'))
    if (!shouldLoad) {
      clearAllDrafts()
      return
    }

    editableTemplate.value = {
      id: '',
      name: draft.name ?? '',
      description: draft.description ?? '',
      content: draft.content,
      category: draft.category ?? 'invoice',
      previewData: draft.previewData ?? {},
      settings: draft.settings ?? {},
      isActive: true,
      isDefault: false,
      isSystem: false
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(draftId.value)
  }

  const clearAllDrafts = () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('template_draft_'))
      .forEach(key => {
        localStorage.removeItem(key)
      })
  }

  return {
    checkForUnsavedDraft,
    saveDraft,
    loadDraft,
    clearDraft,
    clearAllDrafts,
  }
}
