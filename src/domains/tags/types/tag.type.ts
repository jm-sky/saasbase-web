export interface ITag {
  id: string
  name: string
  slug: string
}

export type TModelTagCreateFunction = (modelId: string, tag: string) => Promise<ITag>
export type TModelTagDeleteFunction = (modelId: string, tag: string) => Promise<void>

export interface IModelTagService {
  create: TModelTagCreateFunction
  delete: TModelTagDeleteFunction
}