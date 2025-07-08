import type { TUUID } from './common'

export interface IPaymentMethod {
  id: TUUID
  name: string
  key: string
  paymentDays?: number
}