import type { TUUID } from "@/domains/shared/types/common"

export interface IPositionCategory {
  id: TUUID
  name: string
  slug: string
  description: string
  sortOrder: number
  isActive: boolean
}
