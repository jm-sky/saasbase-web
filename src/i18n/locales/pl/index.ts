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

export const pl = {
  address,
  auth,
  attachments,
  bankAccounts,
  contractor,
  common,
  comments,
  contacts,
  dashboard,
  notifications: 'Powiadomienia',
  invitation,
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
  settings,
  skills,
  tenant,
  user,
  utils,
  role: {
    select: 'Wybierz rolę',
    search: 'Szukaj roli',
    notFound: 'Nie znaleziono roli',
  },
}
