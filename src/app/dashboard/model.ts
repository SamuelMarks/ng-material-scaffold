export interface IItem {
  createdAt: Date;
  number: number;
  name: string;
}

export interface IGroup {
  groupItems: IItem[];
  name: string;
}
