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
      original: 'Original PDF',
      duplicate: 'Duplicate PDF',
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
}
