import type { ActivityLog } from '@/types/activity-log'

export enum ProjectActivityType {
  AttachmentCreated = 'project.attachment.created',
  AttachmentDeleted = 'project.attachment.deleted',
  AttachmentUpdated = 'project.attachment.updated',
  CommentCreated = 'project.comment.created',
  CommentDeleted = 'project.comment.deleted',
  CommentUpdated = 'project.comment.updated',
  Created = 'project.created',
  Deleted = 'project.deleted',
  LogoCreated = 'project.logo.created',
  LogoDeleted = 'project.logo.deleted',
  LogoUpdated = 'project.logo.updated',
  TagAdded = 'project.tag.added',
  TagRemoved = 'project.tag.removed',
  TagsSynced = 'project.tags.synced',
  Updated = 'project.updated'
}

interface ProjectActivityLogProperties {
  project_id: number
}

export type ProjectActivityLog = ActivityLog<ProjectActivityType, ProjectActivityLogProperties>
