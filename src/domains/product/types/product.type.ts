import { type TDateTime } from '@/domains/shared/types/common'
import type { IMeasurementUnit } from '@/domains/shared/types/measurementUnit.type'
import type { IMedia } from '@/domains/shared/types/media.type'
import type { IVatRate } from '@/domains/shared/types/vatRate.type'

export type TProductType = 'product' | 'service'

export interface IProduct {
  id: string
  tenantId: string
  name: string
  type: TProductType
  description?: string
  unitId?: string
  priceNet?: number
  vatRateId?: string
  logoUrl?: string
  logo?: IMedia
  unit?: IMeasurementUnit
  vatRate?: IVatRate
  tags?: string[]
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface IProductCreate {
  name: string
  type: TProductType
  description?: string
  priceNet?: number
  unitId?: string
  unit?: IMeasurementUnit
  vatRateId?: string
  vatRate?: IVatRate
  logo?: File
}

export interface IProductUpdate {
  id?: string
  name: string
  type: TProductType
  description?: string
  priceNet?: number
  unitId?: string
  unit?: IMeasurementUnit
  vatRateId?: string
  vatRate?: IVatRate
  logo?: File
}