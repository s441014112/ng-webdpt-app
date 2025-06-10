import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzImageModule } from 'ng-zorro-antd/image';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { WidgetRoutingModule } from './widget-routing.module';
import { WidgetComponent } from './widget.component';
import { SingleColumnComponent } from './components/single-column/single-column.component';
import { RootComponentComponent } from './components/root-component/root-component.component';
import { MultiComponentComponent } from './components/multi-component/multi-component.component';
import { HorizontalComponentComponent } from './components/horizontal-component/horizontal-component.component';
import { TitleComponentComponent } from './components/title-component/title-component.component';
import { ContentComponentComponent } from './components/content-component/content-component.component';
import { DividerComponentComponent } from './components/divider-component/divider-component.component';
import { ImageComponentComponent } from './components/image-component/image-component.component';
import { ButtonComponentComponent } from './components/button-component/button-component.component';
import { ListComponentComponent } from './components/list-component/list-component.component';


@NgModule({
  declarations: [
    WidgetComponent,
    SingleColumnComponent,
    RootComponentComponent,
    MultiComponentComponent,
    HorizontalComponentComponent,
    TitleComponentComponent,
    ContentComponentComponent,
    DividerComponentComponent,
    ImageComponentComponent,
    ButtonComponentComponent,
    ListComponentComponent
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzIconModule,
    NzCollapseModule,
    NzButtonModule,
    NzImageModule,
    DragDropModule,
    WidgetRoutingModule
  ],
  exports: [
    SingleColumnComponent
  ]
})
export class WidgetModule { }
