import { Component, OnInit } from '@angular/core';
import  { Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型


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

  // 新增：接收所有画布内部可连接的 DropList ID 集合 (即使不使用，也需要接收以保持接口一致性)
  @Input() allCanvasDropListIds: string[] = [];
  // 新增：用于将拖放事件向上冒泡 (即使不作为容器，也需要有这个 Output 以便 ComponentRenderer 能够订阅)
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();

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
   * 该方法保留，但功能简化，以应对 loopRender 属性的预留性。\
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

  /**
   * 对于基础组件，这个方法通常不会被实际调用来处理 drop 事件，
   * 但为了与 ComponentRenderer 的接口一致性，它需要存在。
   * @param event 拖放事件对象
   */
  onContentDrop(event: CdkDragDrop<any>): void {
    // 基础组件通常不会接收拖放，所以这里可以为空或添加日志
    // console.log('Content component drop event (should not happen usually):', event);
    this.dropEvent.emit(event); // 仍然向上冒泡，以防万一
  }
}