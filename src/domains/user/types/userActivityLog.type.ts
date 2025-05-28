import type { ActivityLog } from '@/types/activity-log'

export enum UserActivityType {
  AddressCreated = 'user.address.created',
  AddressDeleted = 'user.address.deleted',
  AddressSetDefault = 'user.address.set_default',
  AddressUpdated = 'user.address.updated',
  AttachmentCreated = 'user.attachment.created',
  AttachmentDeleted = 'user.attachment.deleted',
  AttachmentUpdated = 'user.attachment.updated',
  BankAccountCreated = 'user.bank_account.created',
  BankAccountDeleted = 'user.bank_account.deleted',
  BankAccountSetDefault = 'user.bank_account.set_default',
  BankAccountUpdated = 'user.bank_account.updated',
  Created = 'user.created',
  Deleted = 'user.deleted',
  InvitationAccepted = 'user.invitation.accepted',
  InvitationSent = 'user.invitation.sent',
  LogoCreated = 'user.logo.created',
  LogoDeleted = 'user.logo.deleted',
  LogoUpdated = 'user.logo.updated',
  Updated = 'user.updated'
}

export type UserActivityLog = ActivityLog<UserActivityType>
