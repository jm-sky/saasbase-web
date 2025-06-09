import { address } from './address'
import { attachments } from './attachments'
import { auth } from './auth'
import { bankAccounts } from './bankAccounts'
import { billing } from './billing'
import { chat } from './chat'
import { comments } from './comments'
import { common } from './common'
import { components } from './components'
import { contacts } from './contacts'
import { contractor } from './contractor'
import { country } from './country'
import { dashboard } from './dashboard'
import feed from './feed'
import { invitation } from './invitation'
import invoice from './invoice'
import { log } from './log'
import { notifications } from './notifications'
import { product } from './product'
import { settings } from './settings'
import { shared } from './shared'
import { skills } from './skills'
import { subscription } from './subscription'
import { tenant } from './tenant'
import { user } from './user'
import { utils } from './utils'

export const en = {
  address,
  auth,
  attachments,
  bankAccounts,
  billing,
  chat,
  contractor,
  common,
  comments,
  components,
  contacts,
  country,
  dashboard,
  feed,
  invitation,
  invoice,
  notifications,
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
  shared,
  settings,
  subscription,
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
