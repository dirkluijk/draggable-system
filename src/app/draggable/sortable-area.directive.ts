import { AfterContentInit, ContentChildren, Directive, EventEmitter, Output, QueryList } from '@angular/core';
import { SortableDirective } from './sortable.directive';

export interface SortEvent {
  index: number;
  newIndex: number;
}

function isRectBelow(event: PointerEvent, rect) {
  return event.clientY > rect.bottom - rect.height / 2;
}

function isRectRightOf(event: PointerEvent, rect) {
  return event.clientX > rect.right - rect.width / 2;
}

function isRectAbove(event: PointerEvent, rect) {
  return event.clientY < rect.top + rect.height / 2;
}

function isRectLeftOf(event: PointerEvent, rect) {
  return event.clientX < rect.left + rect.width / 2;
}

function distanceBetween(rectA: ClientRect, rectB: ClientRect) {
  return Math.sqrt(Math.pow(Math.abs(rectA.left - rectB.left), 2) + Math.pow(Math.abs(rectA.top - rectB.top), 2));
}

@Directive({
  selector: '[appSortableArea]'
})
export class SortableAreaDirective implements AfterContentInit {
  @ContentChildren(SortableDirective) sortables: QueryList<SortableDirective>;

  @Output() sort = new EventEmitter<SortEvent>();

  private viewRects: ClientRect[];

  ngAfterContentInit(): void {
    this.sortables.forEach(sortable => {
      sortable.dragStart.subscribe(() => this.measeBoundaries());
      sortable.dragMove.subscribe(event => this.detectSorting(event, sortable));
    });
  }

  private measeBoundaries(): void {
    this.viewRects = this.sortables.map(s => s.element.nativeElement.getBoundingClientRect());
  }

  private detectSorting(event: PointerEvent, sortable: SortableDirective): void {
    const sortables = this.sortables.toArray(),
          myIndex = sortables.indexOf(sortable),
          myRect = this.viewRects[myIndex];

    sortables
      .map((_, index) => this.viewRects[index])
      .sort((rectA, rectB) => {
        return distanceBetween(rectA, myRect) - distanceBetween(rectB, myRect);
      })
      .some((rect, index) => {
      if (rect === myRect) {
        return false;
      }

      const before = index < myIndex,
            isHorizontal = myRect.top === rect.top;

      if ((before && isHorizontal && isRectLeftOf(event, rect)) ||
        (before && !isHorizontal && isRectAbove(event, rect)) ||
        (!before && isHorizontal && isRectRightOf(event, rect)) ||
        (!before && !isHorizontal && isRectBelow(event, rect))) {

        this.measeBoundaries();
        this.sort.emit({
          index: myIndex,
          newIndex: index
        });

        return true;
      }

      return false;
    });
  }
}
