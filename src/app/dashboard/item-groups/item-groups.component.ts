import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IGroup, IItem } from '../model';

const GROUPS = [
  <IGroup>{
    name: 'FIRST GROUP',
    groupItems: [],
  },
  <IGroup>{
    name: 'SECOND GROUP',
    groupItems: [],
  },
  <IGroup>{
    name: 'LAST GROUP',
    groupItems: [],
  },
];

@Component({
  selector: 'app-item-groups',
  templateUrl: './item-groups.component.html',
  styleUrls: ['./item-groups.component.scss'],
})
export class ItemGroupsComponent implements OnInit {
  groups: IGroup[] = [];

  constructor() {
    this.groups = GROUPS;
  }

  ngOnInit(): void {}
}
