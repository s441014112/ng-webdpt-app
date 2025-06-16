import { Component, OnInit } from '@angular/core';

import { Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型


import { ComponentNodeModel, ListProps } from '../../../interface/index';
import { COMPONENT_TYPE } from '../../../enum/index'; // 导入 COMPONENT_TYPE 枚举

@Component({
  selector: 'app-list-component',
  templateUrl: './list-component.component.html',
  styleUrls: ['./list-component.component.less'],
  host: {
    '[style.display]': 'flex',
    '[style.width]': '"100%"',
  }
})
export class ListComponentComponent implements OnInit {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 新增：接收所有画布内部可连接的 DropList ID 集合
  @Input() allCanvasDropListIds: string[] = [];
  // 新增：用于将拖放事件向上冒泡
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();

  // 引入 COMPONENT_TYPE 以在模板中使用
  componentTypes = COMPONENT_TYPE;

  constructor() {}

  ngOnInit(): void {}

  get listProps(): ListProps {
    return this.node.props as ListProps;
  }

  /**
 * 过滤出所有类型为 SLOT 的子组件。
 * 多列组件的子元素是插槽，插槽的子元素才是实际的组件。
 */
  get slotChildren(): ComponentNodeModel[] {
    return this.node.children?.filter(child => child.type === COMPONENT_TYPE.SLOT) || [];
  }

  onComponentClick(event: MouseEvent, component: ComponentNodeModel): void {
    event.stopPropagation();
    this.selectComponent.emit(component);
  }

  isSelected(component: ComponentNodeModel): boolean {
    return this.selectedComponentId === component.id;
  }

  // 处理 List 组件内部的拖放事件
  onListDrop(event: CdkDragDrop<ComponentNodeModel[]>): void {
    // 将拖放事件向上冒泡到 CanvasComponent 进行统一处理
    this.dropEvent.emit(event);
  }
}