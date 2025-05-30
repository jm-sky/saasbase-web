import { address } from './address'
import { attachments } from './attachments'
import { auth } from './auth'
import { bankAccounts } from './bankAccounts'
import { comments } from './comments'
import { common } from './common'
import { contacts } from './contacts'
import { contractor } from './contractor'
import { dashboard } from './dashboard'
import { invitation } from './invitation'
import { log } from './log'
import { product } from './product'
import { settings } from './settings'
import { skills } from './skills'
import { tenant } from './tenant'
import { user } from './user'
import { utils } from './utils'

export const en = {
  address,
  auth,
  attachments,
  bankAccounts,
  contractor,
  common,
  comments,
  contacts,
  dashboard,
  notifications: 'Notifications',
  invitation,
  company: {
    sources: {
      tooltip: {
        regon: 'REGON is a Polish register of companies and organizations.',
        vies: 'VIES is a European Union register of companies.',
        mf: 'MF is a Polish register of companies and organizations.',
      },
    },
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
  product,
  settings,
  skills,
  tenant,
  user,
  utils,
  role: {
    select: 'Select role',
    search: 'Search role',
    notFound: 'Role not found',
  },
}
