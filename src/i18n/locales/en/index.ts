import { address } from './address'
import { attachments } from './attachments'
import { auth } from './auth'
import { bankAccounts } from './bankAccounts'
import { comments } from './comments'
import { common } from './common'
import { contacts } from './contacts'
import { contractor } from './contractor'
import { product } from './product'
import { settings } from './settings'
import { tenant } from './tenant'

export const en = {
  address,
  auth,
  attachments,
  bankAccounts,
  contractor,
  common,
  comments,
  contacts,
  notifications: 'Notifications',
  invitation: {
    title: 'Invitation',
    description: 'You have been invited to join {tenant} as {role}.',
  },
  layout: {
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    layoutConfig: 'Layout Configuration'
  },
  errors: {
    uploadFailed: 'Upload failed',
  },
  settings,
  product,
  tenant,
  role: {
    select: 'Select role',
    search: 'Search role',
    notFound: 'Role not found',
  },
}
