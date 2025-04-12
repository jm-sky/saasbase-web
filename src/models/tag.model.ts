export interface ITag {
  id: string
  name: string
  color?: string
}

export class Tag {
  static load(data: ITag): Tag {
    return new Tag(data)
  }

  constructor(private data: ITag) {}

  get id(): string {
    return this.data.id
  }

  get name(): string {
    return this.data.name
  }

  get color(): string | undefined {
    return this.data.color
  }
}
