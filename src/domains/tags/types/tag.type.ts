export type TTagColor = 'default'
  | 'success'
  | 'success-intense'
  | 'danger'
  | 'danger-intense'
  | 'info'
  | 'info-intense'
  | 'warning'
  | 'warning-intense'
  | 'dark'
  | 'dark-intense'
  | 'notice'
  | 'notice-intense'

export interface ITagPreview {
  name: string
  color: TTagColor
}

export interface ITag {
  id: string
  name: string
  slug: string
  color: TTagColor
}

export type TModelTagCreateFunction = (modelId: string, tag: string) => Promise<ITag>
export type TModelTagDeleteFunction = (modelId: string, tag: string) => Promise<void>

export interface IModelTagService {
  create: TModelTagCreateFunction
  delete: TModelTagDeleteFunction
}