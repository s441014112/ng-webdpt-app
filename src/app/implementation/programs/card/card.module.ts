import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardRoutingModule } from './card-routing.module';

const programsModules = [

];

@NgModule({
  imports: [
    CommonModule,
    CardRoutingModule,
    ...programsModules
  ],
  declarations: []
})
export class CardModule { }
