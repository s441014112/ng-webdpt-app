import { Component, OnInit } from '@angular/core';
import  { Input, Output, EventEmitter } from '@angular/core';

import { ComponentNodeModel, ButtonProps } from '../../../interface/index';
import { ButtonWidthMode } from '../../../enum';

@Component({
  selector: 'app-button-component',
  templateUrl: './button-component.component.html',
  styleUrls: ['./button-component.component.less']
})
export class ButtonComponentComponent implements OnInit {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 动态计算按钮宽度
  calculatedWidth: string | number = 'auto';

  // 按钮是否禁用
  isDisabled: boolean = false;
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
      this.calculatedWidth = props.width ? Math.min(props.width, 420) : 'auto'; // 最大宽度 420px
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
}
