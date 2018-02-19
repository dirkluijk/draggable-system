import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './draggable.directive';
import { MovableDirective } from './movable.directive';
import { MovableAreaDirective } from './movable-area.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { DraggableHelperDirective } from './draggable-helper.directive';
import { SortableDirective } from './sortable.directive';
import { SortableAreaDirective } from './sortable-area.directive';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule
  ],
  declarations: [
    DraggableDirective,
    MovableDirective,
    MovableAreaDirective,
    DraggableHelperDirective,
    SortableDirective,
    SortableAreaDirective
  ],
  exports: [
    DraggableDirective,
    MovableDirective,
    MovableAreaDirective,
    DraggableHelperDirective,
    SortableDirective,
    SortableAreaDirective
  ]
})
export class DraggableModule { }
