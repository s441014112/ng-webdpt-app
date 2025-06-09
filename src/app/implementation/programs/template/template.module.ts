import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';

const programsModules = [

];

@NgModule({
  imports: [
    CommonModule,
    TemplateRoutingModule,
    ...programsModules
  ],
  declarations: []
})
export class TemplateModule { }
