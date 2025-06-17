import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ComponentNodeModel, SlotProps } from '../../../interface';
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型

@Component({
  selector: 'app-slot-component',
  templateUrl: './slot-component.component.html',
  styleUrls: ['./slot-component.component.less'],
  host: {
    '[style.display]': '"flex"',
    '[style.width]': '"100%"',
  }
})
export class SlotComponentComponent implements OnInit {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;

  // 传递从其内部子组件（通过 app-component-renderer 渲染的）冒泡上来的所有操作事件
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 新增：接收所有画布内部可连接的 DropList ID 集合
  @Input() allCanvasDropListIds: string[] = [];
  // 新增：用于将拖放事件向上冒泡
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();


  constructor() { }

  ngOnInit(): void {}

  get slotProps(): SlotProps {
    return this.node.props as SlotProps;
  }

  /**
   * 处理组件点击事件。
   * 阻止事件冒泡，防止点击子组件时触发父组件的选中。
   * @param event 鼠标事件对象
   * @param component 当前点击的组件节点
   */
  onComponentClick(event: MouseEvent, component: ComponentNodeModel): void {
    event.stopPropagation(); // 阻止事件冒泡
    this.selectComponent.emit(component);
  }

  /**
   * 判断当前组件是否被选中。
   * @param component 当前组件节点
   * @returns 如果是选中组件，则返回 true，否则返回 false。
   */
  isSelected(component: ComponentNodeModel): boolean {
    return this.selectedComponentId === component.id;
  }

  /**
   * 处理从 SlotComponent 自身捕获到的拖放事件。
   * 将事件向上冒泡到 ComponentRenderComponent -> RootComponent -> WidgetComponent。
   * @param event 拖放事件对象
   */
  onSlotDrop(event: CdkDragDrop<any>): void {
    this.dropEvent.emit(event);
  }
}