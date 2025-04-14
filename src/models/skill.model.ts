import { type TSkillLevel } from '@/types'
import { type TDateTime } from '@/types/common'

export interface ISkill {
  id: string
  categoryId: string
  name: string
  description?: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type ISkillCreate = Omit<ISkill, 'id' | 'createdAt' | 'updatedAt'>

export class Skill {
  static load(data: ISkill): Skill {
    if (!data.id) throw new Error('Skill ID is required')
    if (!data.categoryId) throw new Error('Category ID is required')
    if (!data.name) throw new Error('Skill name is required')

    return new Skill(data)
  }

  constructor(private data: ISkill) {}

  get id(): string {
    return this.data.id
  }

  get categoryId(): string {
    return this.data.categoryId
  }

  get name(): string {
    return this.data.name
  }

  get description(): string {
    return this.data.description ?? ''
  }

  get createdAt(): Date {
    return new Date(this.data.createdAt)
  }

  get updatedAt(): Date {
    return new Date(this.data.updatedAt)
  }

  toJSON(): ISkill {
    return { ...this.data }
  }

  equals(other: Skill): boolean {
    return this.id === other.id
  }

  isValid(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return Boolean(this.id && this.categoryId && this.name && this.createdAt && this.updatedAt)
  }

  hasDescription(): boolean {
    return Boolean(this.description)
  }
}

export interface IUserSkill {
  userId: string
  skillId: string
  level: TSkillLevel
  acquiredAt?: TDateTime
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type IUserSkillCreate = Omit<IUserSkill, 'createdAt' | 'updatedAt'>

export class UserSkill {
  static load(data: IUserSkill): UserSkill {
    if (!data.userId) throw new Error('User ID is required')
    if (!data.skillId) throw new Error('Skill ID is required')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!data.level) throw new Error('Skill level is required')

    return new UserSkill(data)
  }

  constructor(private data: IUserSkill) {}

  get userId(): string {
    return this.data.userId
  }

  get skillId(): string {
    return this.data.skillId
  }

  get level(): TSkillLevel {
    return this.data.level
  }

  get acquiredAt(): Date | undefined {
    return this.data.acquiredAt ? new Date(this.data.acquiredAt) : undefined
  }

  get createdAt(): Date {
    return new Date(this.data.createdAt)
  }

  get updatedAt(): Date {
    return new Date(this.data.updatedAt)
  }

  toJSON(): IUserSkill {
    return { ...this.data }
  }

  equals(other: UserSkill): boolean {
    return this.userId === other.userId && this.skillId === other.skillId
  }

  isValid(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return Boolean(this.userId && this.skillId && this.level && this.createdAt && this.updatedAt)
  }

  hasAcquiredDate(): boolean {
    return Boolean(this.acquiredAt)
  }

  isExpert(): boolean {
    return this.level >= 4
  }

  isBeginner(): boolean {
    return this.level <= 2
  }
}
