import type { TDate, TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IUserPreview } from '@/domains/user/types/user.type'

export type TProjectStatus = 'active' | 'completed' | 'archived'

export interface IProject {
  id: TUUID
  tenantId: TUUID
  name: string
  description?: string
  status: TProjectStatus
  ownerId: TUUID
  statusId: TUUID
  startDate: TDate
  endDate?: TDate
  owner: IUserPreview
  users: IUserPreview[]
  requiredSkills: IProjectRequiredSkill[]
  createdAt: TDateTime | Date
  updatedAt: TDateTime | Date
}

export type IProjectCreate = Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>

export interface IProjectRole {
  id: TUUID
  tenantId: TUUID
  name: string
  description?: string
  permissions?: string[]
  createdAt: TDateTime | Date
  updatedAt: TDateTime | Date
}

export interface IProjectUser {
  projectId: TUUID
  userId: TUUID
  projectRoleId: string
}

export interface IProjectRequiredSkill {
  projectId: TUUID
  skillId: TUUID
  requiredLevel: number
}

export interface IProjectGetParams {
  status?: TProjectStatus
  limit?: number
  offset?: number
}
