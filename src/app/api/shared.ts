// TODO: Figure out a generic way of check if strings are dates and converting for all attributes

export interface IDates<T> {
  createdAt: T;
  updatedAt: T;
}

export const parseDates = <T>(obj: IDates<string> & T): T & IDates<Date> => Object.assign(obj, {
  createdAt: new Date(obj.createdAt), updatedAt: new Date(obj.updatedAt)
});
