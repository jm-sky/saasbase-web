import { type TDateTime } from '@/types/common'

export interface ITeam {
  id: string
  name: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type ITeamCreate = Omit<ITeam, 'id' | 'createdAt' | 'updatedAt'>

export class Team {
  private data: ITeam

  static load(data: ITeam): Team {
    if (!data.id) throw new Error('Team ID is required')
    if (!data.name) throw new Error('Team name is required')

    return new Team(data)
  }

  constructor(data: ITeam) {
    this.data = data
  }

  get id(): string {
    return this.data.id
  }

  get name(): string {
    return this.data.name
  }

  get createdAt(): Date {
    return new Date(this.data.createdAt)
  }

  get updatedAt(): Date {
    return new Date(this.data.updatedAt)
  }

  toJSON(): ITeam {
    return { ...this.data }
  }

  equals(other: Team): boolean {
    return this.id === other.id
  }

  isValid(): boolean {
    return Boolean(this.id && this.name && this.createdAt && this.updatedAt)
  }
}
