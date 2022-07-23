import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
  @ViewChild('table', { static: true }) table!: MatTable<IItem>;

  tableDataSource: MatTableDataSource<IItem> = new MatTableDataSource<IItem>();
  displayedColumns = ['select', 'createdAt', 'number', 'name'];
  selection = new SelectionModel<IItem>(true, []);
  dragging: boolean = false;
  dragDisabled = false;

  constructor() {}

  ngOnInit(): void {
    this.tableDataSource.data = ITEMS;
  }

  public drop($event: CdkDragDrop<string, IItem, any>) {
    console.log($event.container.id);
    console.log($event.previousContainer.id);
    console.log($event);
    //this.dragDisabled = true;

    // const previousIndex = this.tableDataSource.data.findIndex(
    //   (d) => d === $event.item.data
    // );

    // moveItemInArray(
    //   this.tableDataSource.data,
    //   previousIndex,
    //   $event.currentIndex
    // );
    // this.table.renderRows();

    // const selections = [];

    // Get the indexes for all selected items
    // _.each(this.items, (item, i) => {
    //   if (item.selected) {
    //     selections.push(i);
    //   }
    // });

    // if (this.selections.length > 1) {
    //   // If multiple selections exist
    //   let newIndex = event.currentIndex;
    //   let indexCounted = false;

    //   // create an array of the selected items
    //   // set newCurrentIndex to currentIndex - (any items before that index)
    //   this.selections = _.sortBy(this.selections, (s) => s);
    //   const selectedItems = _.map(this.selections, (s) => {
    //     if (s < event.currentIndex) {
    //       newIndex--;
    //       indexCounted = true;
    //     }
    //     return this.items[s];
    //   });

    //   // correct the index
    //   if (indexCounted) {
    //     newIndex++;
    //   }

    //   // remove selected items
    //   this.items = _.without(this.items, ...selectedItems);

    //   // add selected items at new index
    //   this.items.splice(newIndex, 0, ...selectedItems);
    // } else {
    //   // If a single selection
    //   moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    // }

    // this.dragging = false;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }
  isSelectedPage() {
    const numSelected = this.selection.selected.length;
    const page = this.tableDataSource.paginator!.page;
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
