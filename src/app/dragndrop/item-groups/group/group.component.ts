import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IGroup, IItem } from '../../model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<IItem>;

  @Input() group: IGroup = <IGroup>{};

  tableDataSource: MatTableDataSource<IItem> = new MatTableDataSource<IItem>();
  displayedColumns = ['createdAt', 'number', 'name'];

  constructor() {}

  ngOnInit(): void {
    this.tableDataSource.data = this.group.groupItems;
  }

  public drop($event: CdkDragDrop<IItem[], IItem[], IItem[]>) {
    $event.item.data.forEach((item) => {
      const currIdx = $event.previousContainer.data.indexOf(item);
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        currIdx,
        $event.container.data.length
      );
    });
    this.table.renderRows();
  }
}
