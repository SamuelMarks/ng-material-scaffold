interface IUserDateType<T> {
  username: string;
  roles: string[];
  password: string;
  createdAt: T;
  updatedAt: T;
}

/**
 * User model with parsed Date fields.
 */
export type IUser = IUserDateType<Date>;

/**
 * User model with string date fields as returned by the API.
 */
export type IUserStringDates = IUserDateType<string>;

/**
 * User payload used for create and update requests.
 */
export type UserUpsert = Pick<IUser, 'username' | 'password' | 'roles'>;
