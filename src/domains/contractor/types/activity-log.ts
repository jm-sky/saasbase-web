import type { ActivityLog } from '@/types/activity-log'

export enum ContractorActivityType {
  AddressCreated = 'contractor.address.created',
  AddressDeleted = 'contractor.address.deleted',
  AddressSetDefault = 'contractor.address.set_default',
  AddressUpdated = 'contractor.address.updated',
  AttachmentCreated = 'contractor.attachment.created',
  AttachmentDeleted = 'contractor.attachment.deleted',
  AttachmentUpdated = 'contractor.attachment.updated',
  BankAccountCreated = 'contractor.bank_account.created',
  BankAccountDeleted = 'contractor.bank_account.deleted',
  BankAccountSetDefault = 'contractor.bank_account.set_default',
  BankAccountUpdated = 'contractor.bank_account.updated',
  CommentCreated = 'contractor.comment.created',
  CommentDeleted = 'contractor.comment.deleted',
  CommentUpdated = 'contractor.comment.updated',
  ContactCreated = 'contractor.contact.created',
  ContactDeleted = 'contractor.contact.deleted',
  ContactUpdated = 'contractor.contact.updated',
  Created = 'contractor.created',
  Deleted = 'contractor.deleted',
  LogoCreated = 'contractor.logo.created',
  LogoDeleted = 'contractor.logo.deleted',
  LogoUpdated = 'contractor.logo.updated',
  Updated = 'contractor.updated'
}

interface ContractorActivityLogProperties {
  contractor_id: number
}

export type ContractorActivityLog = ActivityLog<ContractorActivityType, ContractorActivityLogProperties>
