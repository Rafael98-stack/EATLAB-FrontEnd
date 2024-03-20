import { AuthData } from './auth-data';

export class User {
  accesstoken!: '';
  id!: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  type!: string;
  role!: string;
  user = {};
  constructor(name: string, surname: string, email: string, password: string) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }
}
