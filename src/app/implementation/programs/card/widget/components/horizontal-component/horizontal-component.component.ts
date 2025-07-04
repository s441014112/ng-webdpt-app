import { Component, OnInit } from '@angular/core';

import  { Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型


import { ComponentNodeModel, HorizontalProps } from '../../../interface/index';

import { COMPONENT_TYPE } from '../../../enum/index';

@Component({
  selector: 'app-horizontal-component',
  templateUrl: './horizontal-component.component.html',
  styleUrls: ['./horizontal-component.component.less'],
  host: {
    '[style.display]': '"flex"',
    '[style.width]': '"100%"',
  }
})
export class HorizontalComponentComponent implements OnInit {

  // 接收当前横滑组件的节点数据
  @Input() node!: ComponentNodeModel;
  // 接收当前画布中选中的组件ID，用于判断是否选中
  @Input() selectedComponentId: string | null = null;
  // 当点击组件时，向上层（CanvasComponent）发送选中事件
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 新增：接收所有画布内部可连接的 DropList ID 集合
  @Input() allCanvasDropListIds: string[] = [];
  // 新增：用于将拖放事件向上冒泡
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();


  componentTypes = COMPONENT_TYPE;
  constructor() { }

  ngOnInit(): void {}

  /**
   * 获取横滑组件的属性。
   * 这里进行类型断言，确保 props 具有 HorizontalProps 接口的类型。
   */
  get horizontalProps(): HorizontalProps {
    return this.node.props as HorizontalProps;
  }

  /**
   * 过滤出所有类型为 SLOT 的子组件。
   * 横滑组件的子元素是插槽，插槽的子元素才是实际的组件。
   */
  get slotChildren(): ComponentNodeModel[] {
    return this.node.children?.filter(child => child.type === COMPONENT_TYPE.SLOT) || [];
  }

  /**
   * 处理组件点击事件。
   * 阻止事件冒泡，防止点击子组件时触发父组件的选中。
   * 发送当前横滑组件节点给上层。
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
   * 处理从 HorizontalComponent 自身捕获到的拖放事件。
   * 将事件向上冒泡。
   * @param event 拖放事件对象
   */
  onHorizontalDrop(event: CdkDragDrop<any>): void {
    this.dropEvent.emit(event);
  }
}