export const bankAccounts = {
  title: 'Bank Accounts',
  fields: {
    iban: 'IBAN',
    swift: 'SWIFT',
    currency: 'Currency',
    bankName: 'Bank Name',
    description: 'Description',
  },
  setDefault: 'Set as default',
  add: {
    title: 'Add Bank Account',
    description: 'Add a new bank account to the contractor',
    error: 'Error adding bank account',
  },
  edit: {
    title: 'Edit Bank Account',
    description: 'Edit the bank account',
    error: 'Error editing bank account',
  },
  error: {
    fetchingBankAccounts: 'Error fetching bank accounts',
    settingDefaultBankAccount: 'Error setting default bank account',
  },
  delete: {
    error: 'Error deleting bank account',
    confirmation: 'Are you sure you want to delete this bank account?',
  },
}
