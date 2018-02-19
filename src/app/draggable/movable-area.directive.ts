import { AfterContentInit, ContentChildren, Directive, ElementRef, HostListener, QueryList } from '@angular/core';
import { MovableDirective } from './movable.directive';

interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

@Directive({
  selector: '[appMovableArea]'
})
export class MovableAreaDirective implements AfterContentInit {
  @ContentChildren(MovableDirective) movables: QueryList<MovableDirective>;

  private viewRect?: ClientRect;
  private boundaries?: Boundaries;

  constructor(private element: ElementRef) {}

  ngAfterContentInit(): void {
    this.movables.forEach(movable => {
      movable.dragStart.subscribe(() => this.measureBoundaries(movable));
      movable.dragMove.subscribe(() => this.maintainBoundaries(movable));
    });
  }

  @HostListener('window:resize') onResize(): void {
    this.movables.forEach(movable => {
      this.measureBoundaries(movable);
      this.maintainBoundaries(movable);
    });
  }

  private measureBoundaries(movable: MovableDirective) {
    this.viewRect = this.element.nativeElement.getBoundingClientRect();
    const movableViewRect = movable.element.nativeElement.getBoundingClientRect();

    this.boundaries = {
      minX: this.viewRect.left - movableViewRect.left + movable.position.x,
      maxX: this.viewRect.right - movableViewRect.right + movable.position.x,
      minY: this.viewRect.top - movableViewRect.top + movable.position.y,
      maxY: this.viewRect.bottom - movableViewRect.bottom + movable.position.y
    };
  }

  private maintainBoundaries(movable: MovableDirective) {
    movable.position.x = Math.max(this.boundaries.minX, movable.position.x);
    movable.position.x = Math.min(this.boundaries.maxX, movable.position.x);
    movable.position.y = Math.max(this.boundaries.minY, movable.position.y);
    movable.position.y = Math.min(this.boundaries.maxY, movable.position.y);
  }
}
