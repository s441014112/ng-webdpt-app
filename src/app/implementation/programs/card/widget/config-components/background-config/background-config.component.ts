import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RootProps } from '../../../interface';
import { BackgroundMode, PaddingSize } from '../../../enum';

// 定义组件接收和发出的属性接口
@Component({
  selector: 'app-background-config',
  templateUrl: './background-config.component.html',
  styleUrls: ['./background-config.component.less'] // 更新为 .less 文件
})
export class BackgroundConfigComponent implements OnInit {
  // 接收父组件传入的属性集合
  @Input() properties: RootProps = { backgroundMode: BackgroundMode.TRANSPARENT, rowGap: '', padding: '', backgroundColor: '#ffffff' };
  // 向父组件发出属性变化的事件
  @Output() propertiesChange = new EventEmitter<RootProps>();

  // Radio 组的当前选中项
  selectedOption: string = BackgroundMode.TRANSPARENT;

  // 行间距的当前值
  rowGap: string = '';
  // 内边距的当前值
  currentPadding: string = '';
  // 颜色的当前值
  currentColor: string = '';

  // 下拉框选项，从 0px 到 8px
  spacingOptions: { label: string, value: string }[] = [
    { label: '无', value: PaddingSize.NONE },
    { label: '小', value: PaddingSize.SMALL },
    { label: '中', value: PaddingSize.MEDIUM },
    { label: '大', value: PaddingSize.LARGE },
  ]

  constructor() { }

  ngOnInit(): void {
    // 根据传入的 properties 初始化组件状态
    if (this.properties) {
      this.selectedOption = this.properties.backgroundMode;
      this.rowGap = this.properties.rowGap ?? '';
      this.currentPadding = this.properties.padding ?? '';
      this.currentColor = this.properties.backgroundColor ?? '#ffffff';
    }
    // 确保默认值与输出值一致
    this.emitProperties();
  }

  /**
   * 处理 Radio 选项变化
   * @param value 选中的值 ('transparent' 或 'color')
   */
  onOptionChange(value: string): void {
    this.selectedOption = value;
    this.emitProperties(); // 每次选择变化都发出新的属性集合
  }

  /**
   * 处理行间距下拉框变化
   * @param value 选中的行间距值
   */
  onLineHeightChange(value: string): void {
    this.rowGap = value;
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
    const updatedProperties: RootProps = {
      backgroundMode: this.selectedOption,
      rowGap: this.rowGap,
      padding: this.currentPadding,
    };

    if (this.selectedOption === 'color') {
      updatedProperties.backgroundColor = this.currentColor;
    }
    this.propertiesChange.emit(updatedProperties);
  }
}