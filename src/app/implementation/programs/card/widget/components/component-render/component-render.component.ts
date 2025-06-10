import {
  Component,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  Output,
  EventEmitter,
  Injector,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ComponentNodeModel } from '../../../interface/index';
import { COMPONENT_TYPE } from '../../../enum';

// 导入所有可能被动态渲染的组件
import { SingleColumnComponent } from '../single-column/single-column.component';
import { MultiComponentComponent } from '../multi-component/multi-component.component';
import { HorizontalComponentComponent } from '../horizontal-component/horizontal-component.component';
import { ListComponentComponent } from '../list-component/list-component.component';
import { TitleComponentComponent } from '../title-component/title-component.component';
import { ContentComponentComponent } from '../content-component/content-component.component';
import { DividerComponentComponent } from '../divider-component/divider-component.component';
import { ImageComponentComponent } from '../image-component/image-component.component';
import { ButtonComponentComponent } from '../button-component/button-component.component';
import { SlotComponentComponent } from '../slot-component/slot-component.component';

@Component({
  selector: 'app-component-renderer',
  templateUrl: './component-render.component.html',
  styleUrls: ['./component-render.component.less'],
})

export class ComponentRenderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;

  // 向上冒泡事件，由 CardEditorComponent 统一处理
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();


  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  private componentRef: any; // 用于存储动态创建的组件实例引用

  // 组件类型到实际 Angular 组件类的映射
  private componentMap: { [key: string]: Type<any> } = {
    [COMPONENT_TYPE.SINGLE_COLUMN]: SingleColumnComponent,
    [COMPONENT_TYPE.MULTI_COLUMN]: MultiComponentComponent,
    [COMPONENT_TYPE.HORIZONTAL]: HorizontalComponentComponent,
    [COMPONENT_TYPE.LIST]: ListComponentComponent,
    [COMPONENT_TYPE.TITLE]: TitleComponentComponent,
    [COMPONENT_TYPE.CONTENT]: ContentComponentComponent,
    [COMPONENT_TYPE.DIVIDER]: DividerComponentComponent,
    [COMPONENT_TYPE.IMAGE]: ImageComponentComponent,
    [COMPONENT_TYPE.BUTTON]: ButtonComponentComponent,
    [COMPONENT_TYPE.SLOT]: SlotComponentComponent,
  };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['node'] || changes['selectedComponentId']) {
      this.loadComponent();
    }
  }

  loadComponent(): void {
    if (!this.node || !this.node.type) {
      // 清除可能存在的组件或渲染占位符
      this.clearComponent();
      return;
    }

    const componentType = this.componentMap[this.node.type];

    if (componentType) {
      // 检查是否是同一个组件节点，避免不必要的销毁和重建
      // 如果已经渲染了相同的组件类型且是同一个节点，则只更新 input 属性
      if (this.componentRef && this.componentRef.instance.node?.id === this.node.id && this.componentRef.instance.constructor === componentType) {
        this.updateComponentInputs();
      } else {
        // 清除之前可能存在的组件
        this.clearComponent();

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        this.componentRef = this.container.createComponent(componentFactory, null, this.injector);

        // 设置动态组件的输入属性
        this.updateComponentInputs();

        // 订阅动态组件的输出事件，并向上冒泡
        // 注意：这里需要检查实例上是否存在对应的 EventEmitter，因为不是所有组件都有所有事件
        if (this.componentRef.instance.selectComponent) {
          this.componentRef.instance.selectComponent.subscribe((event: ComponentNodeModel) => this.selectComponent.emit(event));
        }
      }
    } else {
      console.warn(`渲染出错: ${this.node.type}.`);
      this.clearComponent();
    }
  }

  private updateComponentInputs(): void {
    if (this.componentRef) {
      this.componentRef.instance.node = this.node;
      this.componentRef.instance.selectedComponentId = this.selectedComponentId;
    }
  }

  private clearComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    // 清除容器内的所有内容，包括占位符文本或之前动态创建的组件
    this.container.clear();
  }

  ngOnDestroy(): void {
    this.clearComponent();
  }
}