import { Component, OnInit } from '@angular/core';

import  { Input, Output, EventEmitter } from '@angular/core';

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

}
