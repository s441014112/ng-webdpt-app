import { Component, OnInit } from '@angular/core';
import  { Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型


import { ComponentNodeModel, TitleProps } from '../../../interface/index';

@Component({
  selector: 'app-title-component',
  templateUrl: './title-component.component.html',
  styleUrls: ['./title-component.component.less']
})
export class TitleComponentComponent implements OnInit {

  // 接收当前标题组件的节点数据
  @Input() node!: ComponentNodeModel;
  // 接收当前画布中选中的组件ID，用于判断是否选中
  @Input() selectedComponentId: string | null = null;
  // 当点击组件时，向上层（CanvasComponent）发送选中事件
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 新增：接收所有画布内部可连接的 DropList ID 集合 (即使不使用，也需要接收以保持接口一致性)
  @Input() allCanvasDropListIds: string[] = [];
  // 新增：用于将拖放事件向上冒泡 (即使不作为容器，也需要有这个 Output 以便 ComponentRenderer 能够订阅)
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();

  constructor() { }

  ngOnInit(): void {}

/**
   * 获取标题组件的属性。
   * 这里进行类型断言，确保 props 具有 TitleProps 接口的类型。\
   */
  get titleProps(): TitleProps {
    return this.node.props as TitleProps;
  }

  /**
   * 处理组件点击事件。
   * 阻止事件冒泡，防止点击子组件时触发父组件的选中。\
   * 发送当前标题组件节点给上层。
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
   * 对于基础组件，这个方法通常不会被实际调用来处理 drop 事件，
   * 但为了与 ComponentRenderer 的接口一致性，它需要存在。
   * @param event 拖放事件对象
   */
  onTitleDrop(event: CdkDragDrop<any>): void {
    this.dropEvent.emit(event); // 仍然向上冒泡，以防万一
  }
}