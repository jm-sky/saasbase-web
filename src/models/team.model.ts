export class Team {
  id: string
  name: string

  constructor(payload: Partial<Team>) {
    this.id = payload.id ?? self.crypto.randomUUID()
    this.name = payload.name ?? ''
  }
}
