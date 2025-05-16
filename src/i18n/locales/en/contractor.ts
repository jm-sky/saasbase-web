export const contractor = {
  title: 'Contractors',
  contractorDetails: 'Contractor details',
  fields: {
    name: 'Name',
    taxId: 'Tax ID',
    email: 'E-mail',
    phone: 'Phone',
    description: 'Description',
    tags: 'Tags',
  },
  add: {
    title: 'Add Contractor',
    description: 'Add a new contractor to the system.'
  },
  delete: {
    success: 'Contractor deleted successfully',
    error: 'Failed to delete contractor',
    confirm: 'Are you sure you want to delete this contractor?'
  },
  show: {
    error: 'Could not load contractor',
  },
  addresses: {
    add: {
      title: 'Add Address',
      description: 'Add a new address to the contractor.',
    },
    edit: {
      title: 'Edit Address',
      description: 'Edit the address of the contractor.',
    },
  }
}
