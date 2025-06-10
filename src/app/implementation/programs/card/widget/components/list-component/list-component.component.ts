import { Component, OnInit } from '@angular/core';

import  { Input, Output, EventEmitter } from '@angular/core';

import { ComponentNodeModel, ListProps } from '../../../interface/index';
import { COMPONENT_TYPE } from '../../../enum';

@Component({
  selector: 'app-list-component',
  templateUrl: './list-component.component.html',
  styleUrls: ['./list-component.component.less']
})
export class ListComponentComponent implements OnInit {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();
  @Output() addComponent = new EventEmitter<{ parent: ComponentNodeModel, componentType: COMPONENT_TYPE, index?: number }>();
  @Output() deleteComponent = new EventEmitter<{ parent: ComponentNodeModel | null, componentToDelete: ComponentNodeModel }>();
  @Output() updateComponentProps = new EventEmitter<{ componentId: string, newProps: Partial<any> }>();


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

  // 当内部 SingleColumnComponent 内部的 Slot 请求添加新组件时，向上冒泡
  onChildAddComponent(event: { parent: ComponentNodeModel, componentType: COMPONENT_TYPE, index?: number }): void {
    this.addComponent.emit(event);
  }

  // 当内部 SingleColumnComponent 内部的 Slot 请求删除组件时，向上冒泡
  onChildDeleteComponent(event: { parent: ComponentNodeModel | null, componentToDelete: ComponentNodeModel }): void {
    this.deleteComponent.emit(event);
  }

  // 当内部 SingleColumnComponent 或其子组件属性更新时，向上冒泡
  onChildUpdateComponentProps(event: { componentId: string, newProps: Partial<any> }): void {
    this.updateComponentProps.emit(event);
  }

  isSelected(component: ComponentNodeModel): boolean {
    return this.selectedComponentId === component.id;
  }
}
