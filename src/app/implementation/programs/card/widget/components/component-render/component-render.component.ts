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
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型

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
  host: {
    '[style.display]': '"flex"',
    '[style.width]': '"100%"',
  }
})

export class ComponentRenderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;
  // 新增：接收所有画布内部可连接的 DropList ID 集合
  @Input() allCanvasDropListIds: string[] = [];


  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();
  // 新增：用于将拖放事件向上冒泡
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();


  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  private componentRef: any; // 保存动态创建的组件实例引用

  // 映射组件类型到实际的组件类
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
  ) { }

  ngOnInit(): void {
    // 初始渲染组件
    this.renderComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 当输入属性发生变化时，如果 node 发生变化，则重新渲染组件或更新其输入
    if (changes['node'] || changes['selectedComponentId'] || changes['allCanvasDropListIds']) {
      // 只有当组件类型实际发生变化时才重新创建组件
      // 否则，只更新输入属性
      if (changes['node'] && changes['node'].previousValue?.type !== changes['node'].currentValue?.type) {
        this.renderComponent();
      } else {
        this.updateComponentInputs();
      }
    }
  }

  ngOnDestroy(): void {
    // 清理动态创建的组件，防止内存泄漏
    this.clearComponent();
  }

  private renderComponent(): void {
    if (!this.node) {
      this.clearComponent();
      return;
    }

    const componentType = this.componentMap[this.node.type];

    if (componentType) {
      // 检查是否是同一个组件节点，避免不必要的销毁和重建
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

        // 新增：订阅动态组件的 dropEvent，并向上冒泡
        if (this.componentRef.instance.dropEvent) {
          this.componentRef.instance.dropEvent.subscribe((event: CdkDragDrop<any>) => this.dropEvent.emit(event));
        }
      }
    } else {
      console.warn(`渲染出错: 未知组件类型 ${this.node.type}.`);
      this.clearComponent();
    }
  }

  private updateComponentInputs(): void {
    if (this.componentRef) {
      this.componentRef.instance.node = this.node;
      this.componentRef.instance.selectedComponentId = this.selectedComponentId;
      // 新增：传递 allCanvasDropListIds 给动态组件实例
      this.componentRef.instance.allCanvasDropListIds = this.allCanvasDropListIds;
    }
  }

  private clearComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}