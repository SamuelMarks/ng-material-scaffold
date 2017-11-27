// TODO: Figure out a generic way of check if strings are dates and converting for all attributes

interface I {
  createdAt: Date;
  updatedAt: Date;
}

export const parseDates = <T>(obj: T & I & {updatedAt: string, createdAt: string}): T & I => Object.assign(obj, {
  createdAt: obj.createdAt === 'string' ? new Date(obj.createdAt) : obj.createdAt,
  updatedAt: obj.updatedAt === 'string' ? new Date(obj.updatedAt) : obj.updatedAt
});
