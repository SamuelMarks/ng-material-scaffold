interface IUserDateType<T> {
  username: string;
  roles: string;
  password: string;
  createdAt: T;
  updatedAt: T;
}

export type IUser = IUserDateType<Date>;
export type IUserStringDates = IUserDateType<string>;
