import type { IAddress } from '@/domains/shared/types/address.type'
import type { IBankAccount } from '@/domains/shared/types/bankAccount.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IMedia } from '@/domains/shared/types/media.type'

export interface ITenantPreview {
  id: TUUID
  name: string
  slug: string
  vatId?: string
  taxId?: string
  logoUrl?: string
  logo?: IMedia
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface ITenantAddress extends IAddress {
  id: TUUID
  tenantId: TUUID
  meta: Record<string, unknown>
}

export type ITenantAddressCreate = Omit<ITenantAddress, 'id' | 'tenantId' | 'meta' | 'createdAt' | 'updatedAt'>

export interface ITenantBankAccount extends IBankAccount {
  id: TUUID
  tenantId: TUUID
  bankName?: string
  iban: string
  currency?: string
  isDefault: boolean
  description?: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type ITenantBankAccountCreate = Omit<ITenantBankAccount, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>

export interface ITenantPublicProfile {
  id: TUUID
  publicName?: string
  description?: string
  websiteUrl?: string
  socialLinks?: unknown
  visible?: boolean
  industry?: string
  locationCity?: string
  locationCountry?: string
  address?: IAddress
  publicLogo?: IMedia
  bannerImage?: IMedia
}

export interface ITenantPublicProfileCreate {
  publicName?: string
  description?: string
  websiteUrl?: string
  industry?: string
  locationCity?: string
  locationCountry?: string
  socialLinks?: unknown
  visible?: boolean
  address?: IAddress
  publicLogo?: File
  bannerImage?: File
}

export interface ITenantBranding {
  id: TUUID
  colorPrimary?: string
  colorSecondary?: string
  shortName?: string
  theme?: string
  pdfAccentColor?: string
  emailSignatureHtml?: string
  logo?: IMedia
  favicon?: IMedia
  customFont?: IMedia
  pdfLogo?: IMedia
  emailHeaderImage?: IMedia
}

export interface ITenantBrandingUpdate {
  colorPrimary?: string
  colorSecondary?: string
  shortName?: string
  theme?: string
  pdfAccentColor?: string
  emailSignatureHtml?: string
  logo?: File
  favicon?: File
  customFont?: File
  pdfLogo?: File
  emailHeaderImage?: File
}

export interface ITenant {
  id: TUUID
  tenantId: TUUID
  name: string
  slug: string
  country?: string
  vatId?: string
  taxId?: string
  regon?: string
  email?: string
  phone?: string
  website?: string
  description?: string
  logoUrl?: string
  logo?: IMedia
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface ITenantCreate {
  country: string
  vatId: string
  name: string
  slug: string
  regon: string
  taxId: string
  email: string
  phone: string
  website: string
  description: string
  address: {
    street: string
    postalCode: string
    city: string
    region: string
    country: string
  }
  bankAccount: {
    iban: string
    bankName: string
    swift: string
  }
}
