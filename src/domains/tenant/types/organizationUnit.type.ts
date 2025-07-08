import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IUserPreview } from '@/domains/user/types/user.type'

export interface IOrganizationUnitUser extends IUserPreview {
  role: string
  position?: string
}

export interface IOrganizationUnitPreview {
  id: TUUID
  name: string
}

export interface IOrganizationUnitPosition {
  id: TUUID
  name: string
  description: string
  category: string
  categoryId: TUUID
  isActive: boolean
  isDirector: boolean
  isLearning: boolean
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface IOrganizationUnit {
  id: TUUID
  tenantId: TUUID
  name: string
  code: string
  description: string
  parentId?: TUUID
  parent?: IOrganizationUnitPreview
  isActive: boolean
  isTechnical: boolean
  users: IOrganizationUnitUser[]
  positions: IOrganizationUnitPosition[]
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface IOrganizationUnitCreate {
  name: string
  code: string
  description: string
  parentId?: TUUID | null
  isActive: boolean
}

export interface IOrganizationUnitAssignUser {
  unitId: TUUID
  userId: TUUID
  positionId: TUUID
}

export interface IOrganizationUnitPositionCreate {
  unitId: TUUID
  name: string
  description: string
  category: string
  isDirector: boolean
  isLearning: boolean
  isActive: boolean
}
