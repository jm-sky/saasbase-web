export const tenant = {
  fields: {
    name: 'Name',
    slug: 'Slug',
    taxId: 'Tax ID',
    email: 'Email',
    phone: 'Phone',
    website: 'Website',
    country: 'Country',
    description: 'Description',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    deletedAt: 'Deleted At',
  },
  add: {
    title: 'Add Tenant',
    description: 'Add a new tenant to the system.',
  },
  delete: {
    success: 'Tenant deleted successfully',
    error: 'Failed to delete tenant',
    confirm: 'Are you sure you want to delete this tenant?',
  },
  addresses: {
    add: {
      title: 'Add Address',
      description: 'Add a new address to the tenant.',
    },
    edit: {
      title: 'Edit Address',
      description: 'Edit an existing address of the tenant.',
    },
  },
}