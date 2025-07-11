export default {
  title: 'Invoices',
  fields: {},
  add: {
    title: 'Add invoice',
    description: 'Add a new invoice to the system',
    success: 'Invoice added successfully',
    error: 'Failed to add invoice',
    submit: 'Save Invoice',
  },
  edit: {
    title: 'Edit invoice',
    description: 'Edit an existing invoice',
    success: 'Invoice updated successfully',
    error: 'Failed to update invoice',
    submit: 'Save Invoice',
  },
  show: {
    title: 'Invoice',
  },
  delete: {
    confirm: 'Are you sure you want to delete this invoice?',
    success: 'Invoice deleted successfully',
    error: 'Could not delete invoice',
  },
  batchActions: {
    selected: 'Selected',
    clearSelection: 'Clear selection',
    deleteMultiple: 'Delete Selected',
  },
  actions: {
    create: 'Add invoice',
    settings: 'Invoice Settings',
    changeStatus: {
      title: 'Change Status',
      success: 'Status changed successfully',
      error: 'Failed to change status',
    },
    copy: {
      title: 'Copy',
      success: 'Invoice copied successfully',
      error: 'Failed to copy invoice',
    },
    generatePdf: {
      title: 'Generate PDF',
      description: 'Generate a PDF for the invoice',
      original: {
        title: 'Original PDF',
        success: 'Original PDF generated successfully',
        error: 'Failed to generate original PDF',
      },
      duplicate: {
        title: 'Duplicate PDF',
        success: 'Duplicate PDF generated successfully',
        error: 'Failed to generate duplicate PDF',
      },
      more: 'More options',
      fields: {
        template: 'Template',
      },
    },
    sendEmail: {
      title: 'Send Email',
      success: 'Email sent successfully',
      error: 'Failed to send email',
    },
    sendToKsef: {
      title: 'Send to KSeF',
      success: 'Sent to KSeF successfully',
      error: 'Failed to send to KSeF',
    },
    shareLink: {
      title: 'Share Link',
      success: 'Public link copied to clipboard',
      error: 'Failed to generate public link',
    },
    exportBank: {
      title: 'Export Bank Transfer',
      success: 'Bank transfer package exported successfully',
      error: 'Failed to export bank transfer package',
    },
    payment: {
      title: 'Manage Payment',
      attach: 'Attach Payment',
      generate: 'Generate Payment',
    },
    relationships: {
      title: 'Manage Relationships',
      project: 'Link to Project',
      user: 'Link to User',
      contractor: 'Link to Contractor',
    },
    reminders: {
      title: 'Manage Reminders',
      success: 'Reminders managed successfully',
      error: 'Failed to manage reminders',
    },
    recurring: {
      title: 'Setup Recurring',
      success: 'Recurring invoice configured successfully',
      error: 'Failed to configure recurring invoice',
    },
  },
  numberingTemplate: {
    title: 'Numbering Templates',
    subtitle: 'Manage invoice numbering templates for different invoice types',

    groups: {
      basic: 'Basic Invoices',
      advancePayment: 'Advance Payment',
      export: 'Export',
      settlement: 'Settlement',
      ue: 'EU Sales',
      debitNote: 'Debit Notes',
      import: 'Import',
      proforma: 'Proforma',
    },

    types: {
      'basic': 'Basic Invoice',
      'basic-correction': 'Basic Correction',
      'advance-payment': 'Advance Payment',
      'advance-payment-correction': 'Advance Payment Correction',
      'export': 'Export Invoice',
      'export-correction': 'Export Correction',
      'settlement': 'Settlement Invoice',
      'settlement-correction': 'Settlement Correction',
      'proforma': 'Proforma',
      'ue': 'EU Sales Invoice',
      'ue-correction': 'EU Sales Correction',
      'debit-note': 'Debit Note',
      'debit-note-correction': 'Debit Note Correction',
      'import': 'Import Invoice',
      'import-correction': 'Import Correction',
    },

    form: {
      name: 'Template Name',
      namePlaceholder: 'Enter template name',
      invoiceType: 'Invoice Type',
      format: 'Number Format',
      formatHelp: 'Use placeholders: YYYY (year), MM (month), NNN/NNNN (numbers)',
      nextNumber: 'Next Number',
      resetPeriod: 'Reset Period',
      prefix: 'Prefix',
      suffix: 'Suffix',
      prefixPlaceholder: 'Optional prefix',
      suffixPlaceholder: 'Optional suffix',
    },

    resetPeriods: {
      monthly: 'Monthly',
      yearly: 'Yearly',
      never: 'Never',
    },

    formatBuilder: {
      title: 'Format Builder',
      palette: 'Drag elements to build format',
      canvas: 'Format Pattern',
      preview: 'Preview',
      elements: {
        year4: 'Year (YYYY)',
        year2: 'Year (YY)',
        month: 'Month (MM)',
        number3: 'Number (NNN)',
        number4: 'Number (NNNN)',
        text: 'Custom Text',
      },
    },

    actions: {
      add: 'Add Template',
      edit: 'Edit Template',
      delete: 'Delete Template',
      setDefault: 'Set as Default',
      clone: 'Clone Template',
      save: 'Save',
      cancel: 'Cancel',

      create: {
        success: 'Template created successfully',
        error: 'Failed to create template',
      },
      update: {
        success: 'Template updated successfully',
        error: 'Failed to update template',
      },
      deleteTemplate: {
        confirm: 'Are you sure you want to delete this template?',
        confirmDescription: 'This action cannot be undone',
        success: 'Template deleted successfully',
        error: 'Failed to delete template',
      },
      setDefaultTemplate: {
        success: 'Default template updated successfully',
        error: 'Failed to set default template',
      },
    },

    validation: {
      nameRequired: 'Template name is required',
      nameMinLength: 'Template name must be at least 3 characters',
      formatRequired: 'Format is required',
      missingNumberPlaceholder: 'Format must contain at least one number placeholder (NNN or NNNN)',
      invalidPlaceholder: 'Invalid placeholder found in format',
      nextNumberMin: 'Next number must be greater than 0',
      nextNumberRequired: 'Next number is required',
      nextNumberInt: 'Next number must be a whole number',
    },

    states: {
      noTemplates: 'No templates found',
      addFirstTemplate: 'Add your first template',
      default: 'Default',
      loading: 'Loading templates...',
      error: 'Failed to load templates',
    },
  },
}
