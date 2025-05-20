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
  notifications: 'Powiadomienia',
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
  role: {
    select: 'Wybierz rolę',
    search: 'Szukaj roli',
    notFound: 'Nie znaleziono roli',
  },
}
