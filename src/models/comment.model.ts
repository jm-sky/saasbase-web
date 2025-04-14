import { type TDateTime } from '@/types/common'

export interface IComment {
  id: string
  userId: string
  content: string
  commentableId: string
  commentableType: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type ICommentCreate = Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>

export class Comment {
  static load(data: IComment): Comment {
    if (!data.id) throw new Error('Comment ID is required')
    if (!data.userId) throw new Error('User ID is required')
    if (!data.content) throw new Error('Comment content is required')
    if (!data.commentableId) throw new Error('Commentable ID is required')
    if (!data.commentableType) throw new Error('Commentable type is required')

    return new Comment(data)
  }

  constructor(private data: IComment) {}

  get id(): string {
    return this.data.id
  }

  get userId(): string {
    return this.data.userId
  }

  get content(): string {
    return this.data.content
  }

  get commentableId(): string {
    return this.data.commentableId
  }

  get commentableType(): string {
    return this.data.commentableType
  }

  get createdAt(): Date {
    return new Date(this.data.createdAt)
  }

  get updatedAt(): Date {
    return new Date(this.data.updatedAt)
  }

  toJSON(): IComment {
    return { ...this.data }
  }

  equals(other: Comment): boolean {
    return this.id === other.id
  }

  isValid(): boolean {
    return Boolean(
      this.id &&
      this.userId &&
      this.content &&
      this.commentableId &&
      this.commentableType &&
      this.createdAt &&
      this.updatedAt
    )
  }

  isForProject(): boolean {
    return this.commentableType === 'Project'
  }

  isForTask(): boolean {
    return this.commentableType === 'Task'
  }

  isForContractor(): boolean {
    return this.commentableType === 'Contractor'
  }

  isForInvoice(): boolean {
    return this.commentableType === 'Invoice'
  }
}
