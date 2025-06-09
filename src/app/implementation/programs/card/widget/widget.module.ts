import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { WidgetRoutingModule } from './widget-routing.module';
import { WidgetComponent } from './widget.component';


@NgModule({
  declarations: [
    WidgetComponent
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzIconModule,
    NzCollapseModule,
    NzButtonModule,
    WidgetRoutingModule
  ]
})
export class WidgetModule { }
