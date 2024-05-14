export interface IUser {
  id: string
  name: string
  lastName: string
  email: string
  createdAt: Date
}

export class User implements IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  createdAt: Date;

  private constructor(payload: IUser) {
    this.id = payload.id;
    this.name = payload.name;
    this.lastName = payload.lastName;
    this.email = payload.email;
    this.createdAt = payload.createdAt;
  }

  static create(payload: Omit<IUser, 'id' | 'createdAt'>) {
    return new User({
      ...payload,
      id: self.crypto.randomUUID(),
      createdAt: new Date(),
    });
  }

  static load(payload: IUser) {
    return new User(payload);
  }

  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  get initials(): string {
    return `${this.name[0]}${this.lastName[0]}`;
  }
}
