export const address = {
  title: 'Addresses',
  fields: {
    type: 'Type',
    country: 'Country',
    city: 'City',
    street: 'Street',
    building: 'Building',
    flat: 'Flat',
    description: 'Description',
  },
  type: {
    residence: 'Residence',
    billing: 'Billing',
    registeredOffice: 'Registered Office',
    correspondence: 'Correspondence',
    contact: 'Contact',
  },
  setDefault: 'Set as default',
  error: {
    fetchingAddresses: 'Error fetching addresses',
    settingDefaultAddress: 'Error setting default address',
  },
  add: {
    title: 'Add Address',
    description: 'Add a new address to the contractor',
    error: 'Error adding address',
  },
  edit: {
    title: 'Edit Address',
    description: 'Edit the address',
    error: 'Error editing address',
  },
  delete: {
    title: 'Delete Address',
    description: 'Delete Address',
    confirmation: 'Are you sure you want to delete this address?',
    error: 'Error deleting address',
  },
}
