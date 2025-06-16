import { Component, OnInit } from '@angular/core';
import  { Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop'; // 导入 CdkDragDrop 类型


import { ComponentNodeModel, ButtonProps } from '../../../interface/index';
import { ButtonWidthMode } from '../../../enum';

@Component({
  selector: 'app-button-component',
  templateUrl: './button-component.component.html',
  styleUrls: ['./button-component.component.less'],
  host: {
    '[style.display]': 'flex',
    '[style.width]': '"100%"',
  }
})
export class ButtonComponentComponent implements OnInit {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 动态计算按钮宽度
  calculatedWidth: string | number = 'auto';

  // 按钮是否禁用
  isDisabled: boolean = false;

  // 新增：接收所有画布内部可连接的 DropList ID 集合 (即使不使用，也需要接收以保持接口一致性)
  @Input() allCanvasDropListIds: string[] = [];
  // 新增：用于将拖放事件向上冒泡 (即使不作为容器，也需要有这个 Output 以便 ComponentRenderer 能够订阅)
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();


  constructor() { }

  ngOnInit(): void {
    this.updateButtonWidth();
  }

  get buttonProps(): ButtonProps {
    return this.node.props as ButtonProps;
  }

  /**
   * 根据 buttonProps 计算按钮的宽度。
   */
  private updateButtonWidth(): void {
    const props = this.buttonProps;

    if (props.widthMode === ButtonWidthMode.STRETCH) {
      this.calculatedWidth = '100%';
    } else if (props.widthMode === ButtonWidthMode.FIXED) {
      this.calculatedWidth = props.width ? Math.min(props.width, 420) + 'px' : 'auto'; // 最大宽度 420px
    } else {
      this.calculatedWidth = 'auto'; // 自适应
    }
  }

  // 按钮点击事件处理
  onButtonClick(): void {
    console.log('Button clicked!');
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
   * 如果 Button 组件内部需要接收拖放，则可以添加 cdkDropList。
   * @param event 拖放事件对象
   */
  onButtonDrop(event: CdkDragDrop<any>): void {
    // 基础组件通常不会接收拖放，所以这里可以为空或添加日志
    // console.log('Button component drop event (should not happen usually):', event);
    this.dropEvent.emit(event); // 仍然向上冒泡，以防万一
  }
}