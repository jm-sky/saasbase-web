import { address } from './address'
import { attachments } from './attachments'
import { auth } from './auth'
import { bankAccounts } from './bankAccounts'
import { comments } from './comments'
import { common } from './common'
import { contacts } from './contacts'
import { contractor } from './contractor'
import { invitation } from './invitation'
import { log } from './log'
import { product } from './product'
import { settings } from './settings'
import { tenant } from './tenant'
import { user } from './user'

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
  invitation,
  companyLookup: {
    tooltip: 'Lookup company by country and VAT ID',
  },
  layout: {
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    layoutConfig: 'Layout Configuration'
  },
  log,
  errors: {
    uploadFailed: 'Upload failed',
  },
  settings,
  product,
  tenant,
  user,
  role: {
    select: 'Select role',
    search: 'Search role',
    notFound: 'Role not found',
  },
}
