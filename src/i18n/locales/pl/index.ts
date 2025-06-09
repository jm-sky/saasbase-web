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

export const pl = {
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
        regon: 'REGON to rejestr podmiotów gospodarczych w Polsce.',
        vies: 'VIES to rejestr podmiotów gospodarczych w Unii Europejskiej.',
        mf: 'MF to rejestr podmiotów gospodarczych w Polsce.',
      },
    },
  },
  layout: {
    darkMode: 'Tryb ciemny',
    lightMode: 'Tryb jasny',
    layoutConfig: 'Konfiguracja układu'
  },
  log,
  errors: {
    uploadFailed: 'Wystąpił błąd podczas przesyłania pliku',
  },
  product,
  shared,
  settings,
  skills,
  subscription,
  tenant,
  user,
  utils,
  role: {
    select: 'Wybierz rolę',
    search: 'Szukaj roli',
    notFound: 'Nie znaleziono roli',
  },
}
