import { ContentChild, Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DraggableHelperDirective } from './draggable-helper.directive';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  @HostBinding('class.draggable') draggable = true;
  @HostBinding('class.dragging') dragging = false;

  @Output() dragStart = new EventEmitter<PointerEvent>();
  @Output() dragMove = new EventEmitter<PointerEvent>();
  @Output() dragEnd = new EventEmitter<PointerEvent>();

  @ContentChild(DraggableHelperDirective) helper?: DraggableHelperDirective;

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    this.dragStart.emit(event);

    if (this.helper) {
      this.helper.onDragStart(event);
    }
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }

    this.dragMove.emit(event);

    if (this.helper) {
      this.helper.onDragMove(event);
    }
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }

    this.dragEnd.emit(event);
    this.dragging = false;

    if (this.helper) {
      this.helper.onDragEnd(event);
    }
  }
}
