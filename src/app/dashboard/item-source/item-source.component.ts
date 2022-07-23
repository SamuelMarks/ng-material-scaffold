import { SelectionModel } from '@angular/cdk/collections';
import {
  CdkDragDrop,
  CdkDragStart,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { IItem } from '../model';

const ITEMS = [
  <IItem>{
    createdAt: new Date(),
    name: 'ITEM-1',
    number: 1,
  },
  <IItem>{
    createdAt: new Date(),
    name: 'ITEM-2',
    number: 2,
  },
  <IItem>{
    createdAt: new Date(),
    name: 'ITEM-3',
    number: 3,
  },
];

@Component({
  selector: 'app-item-source',
  templateUrl: './item-source.component.html',
  styleUrls: ['./item-source.component.scss'],
})
export class ItemSourceComponent implements OnInit {
  // @Input() items: IItem[] = [];
  @ViewChild('itemSourceTable', { static: true }) table!: MatTable<IItem>;

  tableDataSource: MatTableDataSource<IItem> = new MatTableDataSource<IItem>();
  displayedColumns = ['select', 'createdAt', 'number', 'name'];
  selection = new SelectionModel<IItem>(true, []);
  dragging: boolean = false;
  dragDisabled = false;
  dropSubs!: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.tableDataSource.data = ITEMS;
  }

  public drop($event: CdkDragDrop<IItem[], IItem[], IItem[]>) {
    console.log($event.container.id);
    console.log($event.container.data);
    console.log($event.previousContainer.id);
    console.log($event.previousContainer.data);
    //this.dragDisabled = true;

    transferArrayItem(
      $event.previousContainer.data,
      $event.container.data,
      $event.previousIndex,
      $event.currentIndex
    );

    // this.dragging = false;
  }

  onDragEnded($event: any, dragged: IItem) {
    console.log('element drag ended');
    console.log($event);
  }

  onDragStarted($event: CdkDragStart<IItem[]>, dragged: IItem) {
    const allItems = this.tableDataSource.data;
    this.dropSubs = $event.source.dropped.subscribe(
      (dropped: CdkDragDrop<IItem[], IItem[], IItem[]>) => {
        const tmp = allItems.filter(
          (itm) => dropped.item.data.indexOf(itm) == -1
        );
        this.tableDataSource.data = tmp;
        this.selection.clear();
      }
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  isSelectedPage() {
    const numSelected = this.selection.selected.length;
    //const page = this.tableDataSource.paginator!.page;
    let endIndex: number;
    // First check whether data source length is greater than current page index multiply by page size.
    // If yes then endIdex will be current page index multiply by page size.
    // If not then select the remaining elements in current page only.
    if (
      this.tableDataSource.data.length >
      (this.tableDataSource.paginator!.pageIndex + 1) *
        this.tableDataSource.paginator!.pageSize
    ) {
      endIndex =
        (this.tableDataSource.paginator!.pageIndex + 1) *
        this.tableDataSource.paginator!.pageSize;
    } else {
      // tslint:disable-next-line:max-line-length
      endIndex =
        this.tableDataSource.data.length -
        this.tableDataSource.paginator!.pageIndex *
          this.tableDataSource.paginator!.pageSize;
    }
    console.log(endIndex);
    return numSelected === endIndex;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.tableDataSource.data.forEach((row) => this.selection.select(row));
  }

  selectRows() {
    // tslint:disable-next-line:max-line-length
    let endIndex: number;
    // tslint:disable-next-line:max-line-length
    if (
      this.tableDataSource.data.length >
      (this.tableDataSource.paginator!.pageIndex + 1) *
        this.tableDataSource.paginator!.pageSize
    ) {
      endIndex =
        (this.tableDataSource.paginator!.pageIndex + 1) *
        this.tableDataSource.paginator!.pageSize;
    } else {
      // tslint:disable-next-line:max-line-length
      endIndex = this.tableDataSource.data.length;
    }

    for (
      let index =
        this.tableDataSource.paginator!.pageIndex *
        this.tableDataSource.paginator!.pageSize;
      index < endIndex;
      index++
    ) {
      this.selection.select(this.tableDataSource.data[index]);
    }
  }
}
