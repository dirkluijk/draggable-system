import { Component } from '@angular/core';
import { SortEvent } from './draggable/sortable-area.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sortableList: string[] = [
    'Box 1',
    'Box 2',
    'Box 3',
    'Box 4',
    'Box 5',
  ];

  sorted(event: SortEvent) {
    const item = this.sortableList[event.index];

    this.sortableList[event.index] = this.sortableList[event.newIndex];
    this.sortableList[event.newIndex] = item;
  }
}
