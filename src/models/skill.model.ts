import { type TSkillLevel } from '@/types'

export interface ISkill {
  id: string
  categoryId: string
  name: string
  description?: string
}

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

  toJSON(): ISkill {
    return { ...this.data }
  }

  equals(other: Skill): boolean {
    return this.id === other.id
  }

  isValid(): boolean {
    return Boolean(this.id && this.categoryId && this.name)
  }

  hasDescription(): boolean {
    return Boolean(this.description)
  }
}

export interface IUserSkill {
  userId: string
  skillId: string
  level: TSkillLevel
  acquiredAt?: string
}

export class UserSkill {
  static load(data: IUserSkill): UserSkill {
    if (!data.userId) throw new Error('User ID is required')
    if (!data.skillId) throw new Error('Skill ID is required')
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

  toJSON(): IUserSkill {
    return { ...this.data }
  }

  equals(other: UserSkill): boolean {
    return this.userId === other.userId && this.skillId === other.skillId
  }

  isValid(): boolean {
    return Boolean(this.userId && this.skillId && this.level)
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
