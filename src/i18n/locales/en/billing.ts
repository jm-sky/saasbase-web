export const billing = {
  title: 'Billing',
  billingCustomer: {
    title: 'Billing Customer',
    fields: {
      name: 'Name',
      address: 'Address',
    },
    update: {
      error: 'Error updating billing info',
    },
  },
  checkout: {
    success: {
      title: 'Checkout Success',
      description: 'Your subscription has been successfully purchased.',
    },
    cancelled: {
      title: 'Checkout Cancelled',
      description: 'Your subscription has been cancelled.',
    },
  },
}