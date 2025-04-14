export interface ITag {
  id: string
  name: string
  color?: string
}

export type ITagCreate = Omit<ITag, 'id'>

export class Tag {
  static load(data: ITag): Tag {
    if (!data.id) throw new Error('Tag ID is required')
    if (!data.name) throw new Error('Tag name is required')

    return new Tag(data)
  }

  constructor(private data: ITag) {}

  get id(): string {
    return this.data.id
  }

  get name(): string {
    return this.data.name
  }

  get color(): string {
    return this.data.color ?? '#6B7280' // Default gray color
  }

  toJSON(): ITag {
    return { ...this.data }
  }

  equals(other: Tag): boolean {
    return this.id === other.id
  }

  isValid(): boolean {
    return Boolean(this.id && this.name)
  }

  hasColor(): boolean {
    return Boolean(this.data.color)
  }

  getTextColor(): string {
    // Return black or white based on the background color
    const hex = this.color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#FFFFFF'
  }
}
