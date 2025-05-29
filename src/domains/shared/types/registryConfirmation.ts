import type { TDateTime, TUUID } from './common'

export interface IRegistryConfirmation {
  id: TUUID
  type: 'mf' | 'regon' | 'vies'
  checkedAt: TDateTime
  payload: unknown
  result: boolean
  success: boolean
  createdAt: TDateTime
}