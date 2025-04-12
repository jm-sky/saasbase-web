export interface IComment {
  id: string
  userId: string
  content: string
  commentableId: string
  commentableType: string
  createdAt: string
}

export class Comment {
  static load(data: IComment): Comment {
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
}
