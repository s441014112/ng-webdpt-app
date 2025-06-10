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
}
