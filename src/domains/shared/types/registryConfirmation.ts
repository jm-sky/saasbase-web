import type { TDateTime, TUUID } from './common'

export type TRegistryConfirmationStatus = 'pending' | 'success' | 'failed'

export interface IRegistryConfirmation {
  id: TUUID
  type: 'mf' | 'regon' | 'vies'
  checkedAt: TDateTime
  payload: unknown
  result: boolean
  status: TRegistryConfirmationStatus
  createdAt: TDateTime
}
