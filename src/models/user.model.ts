import dayjs from 'dayjs';

export interface IUserData {
  id: string
  name: string
  lastName: string
  email: string
  createdAt: string | Date
}

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

  private constructor(payload: IUserData) {
    this.id = payload.id;
    this.name = payload.name;
    this.lastName = payload.lastName;
    this.email = payload.email;
    this.createdAt = dayjs(payload.createdAt).toDate();
  }

  static create(payload: Omit<IUserData, 'id' | 'createdAt'>) {
    return new User({
      ...payload,
      id: self.crypto.randomUUID(),
      createdAt: new Date(),
    });
  }

  static load(payload: IUserData) {
    return new User(payload);
  }

  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  get initials(): string {
    return `${this.name[0]}${this.lastName[0]}`;
  }
}
