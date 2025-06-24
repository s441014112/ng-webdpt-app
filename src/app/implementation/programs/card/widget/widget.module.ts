import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

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
import { ComponentRenderComponent } from './components/component-render/component-render.component';
import { SlotComponentComponent } from './components/slot-component/slot-component.component';
import { ColorPickerComponent } from './config-components/color-picker/color-picker.component';
import { BackgroundConfigComponent } from './config-components/background-config/background-config.component';
import { LayoutConfigComponent } from './config-components/layout-config/layout-config.component';
import { SlotConfigComponent } from './config-components/slot-config/slot-config.component';
import { TitleConfigComponent } from './config-components/title-config/title-config.component';
import { ButtonConfigComponent } from './config-components/button-config/button-config.component';
import { ContentConfigComponent } from './config-components/content-config/content-config.component';
import { ImageConfigComponent } from './config-components/image-config/image-config.component';
import { DividerConfigComponent } from './config-components/divider-config/divider-config.component';


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
    ListComponentComponent,
    ComponentRenderComponent,
    SlotComponentComponent,
    ColorPickerComponent,
    BackgroundConfigComponent,
    LayoutConfigComponent,
    SlotConfigComponent,
    TitleConfigComponent,
    ButtonConfigComponent,
    ContentConfigComponent,
    ImageConfigComponent,
    DividerConfigComponent
  ],
  imports: [
    DragDropModule,
    CommonModule,
    NzLayoutModule,
    NzIconModule,
    NzCollapseModule,
    NzButtonModule,
    NzImageModule,
    NzDividerModule,
    WidgetRoutingModule,
    NzSelectModule,
    FormsModule,
    NzRadioModule,
    NzListModule,
    NzInputModule,
    NzInputNumberModule,
    NzSwitchModule
  ],
  exports: [
    SingleColumnComponent,
    RootComponentComponent,
    MultiComponentComponent,
    HorizontalComponentComponent,
    TitleComponentComponent,
    ContentComponentComponent,
    DividerComponentComponent,
    ImageComponentComponent,
    ButtonComponentComponent,
    ListComponentComponent,
    SlotComponentComponent,
    ColorPickerComponent
  ]
})
export class WidgetModule { }
