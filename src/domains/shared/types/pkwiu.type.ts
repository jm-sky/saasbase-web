import type { TDateTime } from './common'

export interface IPkwiu {
  code: string
  parentCode?: string
  name: string
  description?: string
  level: number
  isActive: boolean
  hierarchyPath: string
  isLeaf: boolean
  children?: IPkwiu[]
  parent?: IPkwiu
  createdAt: TDateTime
  updatedAt: TDateTime
}
