import { Component, OnInit } from '@angular/core';
import  { Input, Output, EventEmitter } from '@angular/core';

import { ComponentNodeModel, ContentProps } from '../../../interface/index';

@Component({
  selector: 'app-content-component',
  templateUrl: './content-component.component.html',
  styleUrls: ['./content-component.component.less']
})
export class ContentComponentComponent implements OnInit {

  // 接收当前文本组件的节点数据
  @Input() node!: ComponentNodeModel;
  // 接收当前画布中选中的组件ID，用于判断是否选中
  @Input() selectedComponentId: string | null = null;
  // 当点击组件时，向上层（CanvasComponent）发送选中事件
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();
  constructor() { }

  ngOnInit(): void {}

  /**
   * 获取文本组件的属性。
   * 这里进行类型断言，确保 props 具有 ContentProps 接口的类型。
   */
  get contentProps(): ContentProps {
    return this.node.props as ContentProps;
  }

  /**
   * 移除循环渲染功能，只返回原始文本。
   * 该方法保留，但功能简化，以应对 loopRender 属性的预留性。
   */
  get displayText(): string {
    return this.contentProps.text || '默认文本内容';
  }

  onComponentClick(event: MouseEvent, component: ComponentNodeModel): void {
    event.stopPropagation();
    this.selectComponent.emit(component);
  }

  isSelected(component: ComponentNodeModel): boolean {
    return this.selectedComponentId === component.id;
  }

}
