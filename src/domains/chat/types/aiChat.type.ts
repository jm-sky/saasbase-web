export interface IAiChatMessage {
  id: string
  index: number
  content: string | null
  provider: string | null
  model: string | null
}
