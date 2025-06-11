import { Component, OnInit } from '@angular/core';
import  { Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型

import { ComponentNodeModel, RootProps } from '../../../interface/index';
import { COMPONENT_TYPE } from '../../../enum/index';

@Component({
  selector: 'app-root-component',
  templateUrl: './root-component.component.html',
  styleUrls: ['./root-component.component.less']
})

export class RootComponentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // 接收当前 Root 组件的节点数据
  @Input() node: ComponentNodeModel | null = null;
  // 接收当前画布中选中的组件ID，用于判断是否选中
  @Input() selectedComponentId: string | null = null;
  // 当点击组件时，向上层（CanvasComponent）发送选中事件
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 用于将来自子组件的拖放事件向上冒泡
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();

  // 新增：接收所有画布内部可连接的 DropList ID 集合
  @Input() allCanvasDropListIds: string[] = [];


  /**
   * 获取 Root 组件的属性。
   * 这里进行类型断言，确保 props 具有 RootProps 接口的类型。
   */
  get rootProps(): RootProps | null {
    return this.node?.props as RootProps || null;
  }

  /**
   * 处理组件点击事件。
   * 阻止事件冒泡，防止点击子组件时触发父组件的选中。
   * 发送当前 Root 组件节点给上层。
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
   * 处理从 RootComponent 自身或其他子组件捕获到的拖放事件。
   * 将事件向上冒泡到 WidgetComponent。
   * @param event 拖放事件对象
   */
  onChildDrop(event: CdkDragDrop<any>): void {
    this.dropEvent.emit(event);
  }

}