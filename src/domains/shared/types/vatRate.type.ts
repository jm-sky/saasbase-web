export type TVatRateType =
  | 'percentage'
  | 'zero_percent'
  | 'exempt'
  | 'not_subject'
  | 'reverse_charge'
  | 'margin_scheme'

export interface IVatRate {
  id: string
  name: string
  rate: number
  type: TVatRateType
  country?: string
}
