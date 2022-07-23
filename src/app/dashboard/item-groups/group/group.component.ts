import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IGroup, IItem } from '../../model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  @Input() group: IGroup = <IGroup>{};

  tableDataSource: MatTableDataSource<IItem> = new MatTableDataSource<IItem>();
  displayedColumns = ['createdAt', 'number', 'name'];

  constructor() {}

  ngOnInit(): void {
    this.tableDataSource.data = this.group.groupItems;
  }

  public drop($event: CdkDragDrop<string, IItem[], any>) {
    console.log('GroupComponent drop');
    console.log($event);
  }
}
