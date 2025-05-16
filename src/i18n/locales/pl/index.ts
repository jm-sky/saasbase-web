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

export const pl = {
  address,
  auth,
  attachments,
  bankAccounts,
  contractor,
  common,
  comments,
  contacts,
  layout: {
    darkMode: 'Tryb ciemny',
    lightMode: 'Tryb jasny',
    layoutConfig: 'Konfiguracja układu'
  },
  errors: {
    uploadFailed: 'Wystąpił błąd podczas przesyłania pliku',
  },
  settings,
  product,
  tenant,
}
