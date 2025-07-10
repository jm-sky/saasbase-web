import type { TUUID } from './common'

export interface IPaymentMethod {
  id: TUUID
  name: string
  code: string
  paymentDays?: number
}
