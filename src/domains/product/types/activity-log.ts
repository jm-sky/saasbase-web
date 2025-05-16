import type { ActivityLog } from '@/types/activity-log'

export enum ProductActivityType {
  AttachmentCreated = 'product.attachment.created',
  AttachmentDeleted = 'product.attachment.deleted',
  AttachmentUpdated = 'product.attachment.updated',
  CommentCreated = 'product.comment.created',
  CommentDeleted = 'product.comment.deleted',
  CommentUpdated = 'product.comment.updated',
  Created = 'product.created',
  Deleted = 'product.deleted',
  LogoCreated = 'product.logo.created',
  LogoDeleted = 'product.logo.deleted',
  LogoUpdated = 'product.logo.updated',
  TagAdded = 'product.tag.added',
  TagRemoved = 'product.tag.removed',
  TagsSynced = 'product.tags.synced',
  Updated = 'product.updated'
}

interface ProductActivityLogProperties {
  product_id: number
}

export type ProductActivityLog = ActivityLog<ProductActivityType, ProductActivityLogProperties>
