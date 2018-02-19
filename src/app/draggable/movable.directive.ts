import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

interface Position {
  x: number;
  y: number;
}

@Directive({
  selector: '[appMovable]'
})
export class MovableDirective extends DraggableDirective {
  @HostBinding('style.transform') get transform(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `translateX(${this.position.x}px) translateY(${this.position.y}px)`
    );
  }

  position: Position = {x: 0, y: 0};

  private viewRect: ClientRect;
  private startPosition: Position = {x: 0, y: 0};

  constructor(private sanitizer: DomSanitizer, public element: ElementRef) {
    super();
  }

  @HostListener('dragStart', ['$event']) onDragStart(event: PointerEvent): void {
    this.viewRect = this.element.nativeElement.getBoundingClientRect();

    this.startPosition = {
      x: event.pageX - this.position.x,
      y: event.pageY - this.position.y
    };
  }

  @HostListener('dragMove', ['$event']) onDragMove(event: PointerEvent): void {
    this.position.x = event.pageX - this.startPosition.x;
    this.position.y = event.pageY - this.startPosition.y;
  }
}
