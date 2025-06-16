import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SlotProps } from '../../../interface';
import { PaddingSize } from '../../../enum';


@Component({
  selector: 'app-slot-config',
  templateUrl: './slot-config.component.html',
  styleUrls: ['./slot-config.component.less']
})
export class SlotConfigComponent implements OnInit {

  // 接收父组件传入的属性集合
  @Input() properties: Record<string, any> = { justifyContent: '', alignItems: '', rowGap: 0, padding: 0 };
  // 向父组件发出属性变化的事件
  @Output() propertiesChange = new EventEmitter<SlotProps>();

  // 水平对齐
  justifyContent: string = '';
  // 行间距的当前值
  currentLineHeight: string = '0';
  // 内边距的当前值
  currentPadding: string = '0';
  // 垂直对齐
  alignItems: string = '';

  // 下拉框选项，从 0px 到 8px
  spacingOptions: { label: string, value: string }[] = [
    { label: '2px', value: PaddingSize.NONE },
    { label: '4px', value: PaddingSize.SMALL },
    { label: '6px', value: PaddingSize.MEDIUM },
    { label: '8px', value: PaddingSize.LARGE },
  ]

  constructor() { }

  ngOnInit(): void {
    // 根据传入的 properties 初始化组件状态
    if (this.properties) {
      this.justifyContent = this.properties.justifyContent;
      this.currentLineHeight = this.properties.rowGap ?? 0;
      this.currentPadding = this.properties.padding ?? 0;
      this.alignItems = this.properties.alignItems;
    }
    // 确保默认值与输出值一致
    this.emitProperties();
  }

  /**
   * 处理 Radio 选项变化
   * @param value 选中的值
   */
  onJustifyChange(value: string): void {
    this.justifyContent = value;
    this.emitProperties();
  }

  /**
 * 处理 Radio 选项变化
 * @param value 选中的值
 */
  onAlignChange(value: string): void {
    this.alignItems = value;
    this.emitProperties();
  }

  /**
   * 处理行间距下拉框变化
   * @param value 选中的行间距值
   */
  onLineHeightChange(value: string): void {
    this.currentLineHeight = value;
    this.emitProperties();
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
   * 组合当前状态并发出属性集合
   */
  private emitProperties(): void {
    const updatedProperties: SlotProps = {
      rowGap: this.currentLineHeight,
      padding: this.currentPadding,
      justifyContent: this.justifyContent,
      alignItems: this.alignItems
    };
    this.propertiesChange.emit(updatedProperties);
  }

}
