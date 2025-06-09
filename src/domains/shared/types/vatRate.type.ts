import type { TDateTime } from './common'

export interface IVatRate {
  id: string
  name: string
  rate: number
  createdAt: TDateTime
}
