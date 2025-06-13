import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TitleProps } from '../../../interface';


@Component({
  selector: 'app-title-config',
  templateUrl: './title-config.component.html',
  styleUrls: ['./title-config.component.less']
})
export class TitleConfigComponent implements OnInit {
  // 接收父组件传入的属性集合
  @Input() properties: TitleProps = { text: '', fontColor: '', align: '' };
  // 向父组件发出属性变化的事件
  @Output() propertiesChange = new EventEmitter<TitleProps>();

  // 水平对齐
  text: string = '';
  // 行间距的当前值
  align: string = '';
  // 垂直对齐
  fontColor: string = '#ffffff';
  constructor() { }

  ngOnInit(): void {
    // 根据传入的 properties 初始化组件状态
    if (this.properties) {
      this.text = this.properties.text;
      this.align = this.properties.align;
      this.fontColor = this.properties.fontColor;
    }
    // 确保默认值与输出值一致
    this.emitProperties();
  }

  /**
  * 处理 Radio 选项变化
  * @param value 选中的值
  */
  onAlignChange(value: string): void {
    this.align = value;
    this.emitProperties();
  }

  /**
 * 处理颜色选择器变化
 * @param value 选中的颜色值
 */
  onColorChange(value: string): void {
    this.fontColor = value;
    this.emitProperties(); // 每次选择变化都发出新的属性集合
  }
  /**
   * 组合当前状态并发出属性集合
   */
  private emitProperties(): void {
    const updatedProperties: TitleProps = {
      text: this.text,
      align: this.align,
      fontColor: this.fontColor
    };
    this.propertiesChange.emit(updatedProperties);
  }

}
