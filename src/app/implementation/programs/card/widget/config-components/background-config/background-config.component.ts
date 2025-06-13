import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RootProps } from '../../../interface';

// 定义组件接收和发出的属性接口
export interface BackgroundProperties extends RootProps {
  type: 'transparent' | 'color';
}

@Component({
  selector: 'app-background-config',
  templateUrl: './background-config.component.html',
  styleUrls: ['./background-config.component.less'] // 更新为 .less 文件
})
export class BackgroundConfigComponent implements OnInit {
  // 接收父组件传入的属性集合
  @Input() properties: Record<string, any> = { type: 'transparent', rowGap: 0, padding: 0, backgroundColor: '#ffffff' };
  // 向父组件发出属性变化的事件
  @Output() propertiesChange = new EventEmitter<BackgroundProperties>();

  // Radio 组的当前选中项
  selectedOption: 'transparent' | 'color' = 'transparent';

  // 行间距的当前值
  currentLineHeight: string = '';
  // 内边距的当前值
  currentPadding: string = '';
  // 颜色的当前值
  currentColor: string = '#ffffff';

  // 下拉框选项，从 0px 到 8px
  spacingOptions: string[] = Array.from({ length: 9 }, (_, i) => i + ''); // [0, 1, ..., 8]

  constructor() { }

  ngOnInit(): void {
    // 根据传入的 properties 初始化组件状态
    if (this.properties) {
      this.selectedOption = this.properties.type;
      this.currentLineHeight = this.properties.rowGap ?? 0;
      this.currentPadding = this.properties.padding ?? 0;
      this.currentColor = this.properties.color ?? '#ffffff';
    }
    // 确保默认值与输出值一致
    this.emitProperties();
  }

  /**
   * 处理 Radio 选项变化
   * @param value 选中的值 ('transparent' 或 'color')
   */
  onOptionChange(value: 'transparent' | 'color'): void {
    this.selectedOption = value;
    this.emitProperties(); // 每次选择变化都发出新的属性集合
  }

  /**
   * 处理行间距下拉框变化
   * @param value 选中的行间距值
   */
  onLineHeightChange(value: string): void {
    this.currentLineHeight = value;
    this.emitProperties(); // 每次选择变化都发出新的属性集合
  }

  /**
   * 处理内边距下拉框变化
   * @param value 选中的内边距值
   */
  onPaddingChange(value: string): void {
    this.currentPadding = value;
    this.emitProperties(); // 每次选择变化都发出新的属性集合
  }

  /**
   * 处理颜色选择器变化
   * @param value 选中的颜色值
   */
  onColorChange(value: string): void {
    this.currentColor = value;
    this.emitProperties(); // 每次选择变化都发出新的属性集合
  }

  /**
   * 组合当前状态并发出属性集合
   */
  private emitProperties(): void {
    const updatedProperties: BackgroundProperties = {
      type: this.selectedOption
    };

    if (this.selectedOption === 'transparent') {
      updatedProperties.rowGap = this.currentLineHeight;
      updatedProperties.padding = this.currentPadding;
    } else {
      updatedProperties.backgroundColor = this.currentColor;
    }
    this.propertiesChange.emit(updatedProperties);
  }
}