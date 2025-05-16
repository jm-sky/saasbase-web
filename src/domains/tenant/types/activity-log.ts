import type { ActivityLog } from '@/types/activity-log'

export enum TenantActivityType {
  AddressCreated = 'tenant.address.created',
  AddressDeleted = 'tenant.address.deleted',
  AddressSetDefault = 'tenant.address.set_default',
  AddressUpdated = 'tenant.address.updated',
  AttachmentCreated = 'tenant.attachment.created',
  AttachmentDeleted = 'tenant.attachment.deleted',
  AttachmentUpdated = 'tenant.attachment.updated',
  BankAccountCreated = 'tenant.bank_account.created',
  BankAccountDeleted = 'tenant.bank_account.deleted',
  BankAccountSetDefault = 'tenant.bank_account.set_default',
  BankAccountUpdated = 'tenant.bank_account.updated',
  Created = 'tenant.created',
  Deleted = 'tenant.deleted',
  InvitationAccepted = 'tenant.invitation.accepted',
  InvitationSent = 'tenant.invitation.sent',
  LogoCreated = 'tenant.logo.created',
  LogoDeleted = 'tenant.logo.deleted',
  LogoUpdated = 'tenant.logo.updated',
  Updated = 'tenant.updated'
}

interface TenantActivityLogProperties {
  tenant_id: number
}

export type TenantActivityLog = ActivityLog<TenantActivityType, TenantActivityLogProperties>
