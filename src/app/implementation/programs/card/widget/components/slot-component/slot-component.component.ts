import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ComponentNodeModel, SlotProps } from '../../../interface';

@Component({
  selector: 'app-slot-component',
  templateUrl: './slot-component.component.html',
  styleUrls: ['./slot-component.component.less']
})
export class SlotComponentComponent implements OnInit {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;

  // 传递从其内部子组件（通过 app-component-renderer 渲染的）冒泡上来的所有操作事件
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  constructor() { }

  ngOnInit(): void {}

  get slotProps(): SlotProps {
    return this.node.props as SlotProps;
  }

}
