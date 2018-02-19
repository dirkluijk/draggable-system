import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appDraggableHelper]'
})
export class DraggableHelperDirective implements OnInit, OnDestroy {
  private dragElement: HTMLElement;
  private overlayRef: OverlayRef;
  private positionStrategy: GlobalPositionStrategy;
  private relativePosition: any;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainerRef: ViewContainerRef,
              private overlay: Overlay) {
  }

  ngOnInit(): void {
    this.positionStrategy = new GlobalPositionStrategy(document);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy
    });
  }

  ngOnDestroy(): void {
    this.overlayRef.dispose();
  }

  onDragStart(event: PointerEvent) {
    this.dragElement = event.target as HTMLElement;
    const rect = this.dragElement.getBoundingClientRect();

    this.relativePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    this.overlayRef.getConfig().width = rect.width;
    this.overlayRef.overlayElement.classList.remove('animated');
  }

  onDragMove(event: PointerEvent) {
    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(new CdkPortal(this.templateRef, this.viewContainerRef));
    }

    this.positionStrategy.left(`${event.clientX - this.relativePosition.x}px`);
    this.positionStrategy.top(`${event.clientY - this.relativePosition.y}px`);
    this.positionStrategy.apply();
  }

  onDragEnd(event: PointerEvent) {
    if (!this.overlayRef.hasAttached()) {
      return;
    }

    const rect = this.dragElement.getBoundingClientRect();

    this.overlayRef.overlayElement.classList.add('animated');

    this.positionStrategy.left(`${rect.left}px`);
    this.positionStrategy.top(`${rect.top}px`);
    this.positionStrategy.apply();

    fromEvent(this.overlayRef.overlayElement, 'transitionend').pipe(
      take(1)
    ).subscribe(() => {
      this.overlayRef.overlayElement.classList.remove('animated');
      this.overlayRef.detach();
    });
  }
}
