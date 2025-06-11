import { Component, OnInit } from '@angular/core';

import  { Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型


import { ComponentNodeModel, ListProps } from '../../../interface/index';

@Component({
  selector: 'app-list-component',
  templateUrl: './list-component.component.html',
  styleUrls: ['./list-component.component.less']
})
export class ListComponentComponent implements OnInit {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 新增：接收所有画布内部可连接的 DropList ID 集合
  @Input() allCanvasDropListIds: string[] = [];
  // 新增：用于将拖放事件向上冒泡
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();


  constructor() {}

  ngOnInit(): void {}

  get listProps(): ListProps {
    return this.node.props as ListProps;
  }

  onComponentClick(event: MouseEvent, component: ComponentNodeModel): void {
    event.stopPropagation();
    this.selectComponent.emit(component);
  }

  // 当内部的 SingleColumnComponent 被选中时，向上冒泡选中事件
  onChildSelect(childNode: ComponentNodeModel): void {
    this.selectComponent.emit(childNode);
  }

  isSelected(component: ComponentNodeModel): boolean {
    return this.selectedComponentId === component.id;
  }

  /**
   * 处理从 ListComponent 自身捕获到的拖放事件。
   * 将事件向上冒泡。
   * @param event 拖放事件对象
   */
  onListDrop(event: CdkDragDrop<any>): void {
    this.dropEvent.emit(event);
  }
}