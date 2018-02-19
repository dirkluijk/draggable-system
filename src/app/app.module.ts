import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DraggableModule } from './draggable/draggable.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DraggableModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
