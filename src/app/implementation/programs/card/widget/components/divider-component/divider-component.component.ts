import { Component, OnInit } from '@angular/core';

import  { Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型


import { ComponentNodeModel, DividerProps } from '../../../interface/index';

@Component({
  selector: 'app-divider-component',
  templateUrl: './divider-component.component.html',
  styleUrls: ['./divider-component.component.less']
})
export class DividerComponentComponent implements OnInit {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 新增：接收所有画布内部可连接的 DropList ID 集合 (即使不使用，也需要接收以保持接口一致性)
  @Input() allCanvasDropListIds: string[] = [];
  // 新增：用于将拖放事件向上冒泡 (即使不作为容器，也需要有这个 Output 以便 ComponentRenderer 能够订阅)
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();

  constructor() { }

  ngOnInit(): void {
  }

  get dividerProps(): DividerProps {
    return this.node.props as DividerProps;
  }

  onComponentClick(event: MouseEvent, component: ComponentNodeModel): void {
    event.stopPropagation();
    this.selectComponent.emit(component);
  }

  isSelected(component: ComponentNodeModel): boolean {
    return this.selectedComponentId === component.id;
  }

  /**
   * 对于基础组件，这个方法通常不会被实际调用来处理 drop 事件，
   * 但为了与 ComponentRenderer 的接口一致性，它需要存在。
   * @param event 拖放事件对象
   */
  onDividerDrop(event: CdkDragDrop<any>): void {
    // 基础组件通常不会接收拖放，所以这里可以为空或添加日志
    // console.log('Divider component drop event (should not happen usually):', event);
    this.dropEvent.emit(event); // 仍然向上冒泡，以防万一
  }

}