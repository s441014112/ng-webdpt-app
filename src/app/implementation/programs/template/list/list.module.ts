import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';

import { SharedModule } from '../../../shared/shared.module';
import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzListModule,
    SharedModule,
    ListRoutingModule
  ]
})
export class ListModule { }
