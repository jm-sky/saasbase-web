import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IUserPreview } from '@/domains/user/types/user.type'

export interface IOrganizationUnit {
  id: TUUID
  name: string
  code: string
  description: string
  parentId?: TUUID
  isActive: boolean
  users: IUserPreview[]
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface IOrganizationUnitCreate {
  name: string
  code: string
  description: string
  parentId?: TUUID
  isActive: boolean
}
