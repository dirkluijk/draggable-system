import { Directive, ElementRef } from '@angular/core';
import { DraggableDirective } from './draggable.directive';

@Directive({
  selector: '[appSortable]'
})
export class SortableDirective extends DraggableDirective {
  constructor(public element: ElementRef) {
    super();
  }
}
