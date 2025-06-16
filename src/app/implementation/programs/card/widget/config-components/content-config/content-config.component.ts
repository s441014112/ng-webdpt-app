import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContentProps } from '../../../interface';
import { ContentFontSize } from '../../../enum';

@Component({
  selector: 'app-content-config',
  templateUrl: './content-config.component.html',
  styleUrls: ['./content-config.component.less']
})
export class ContentConfigComponent implements OnInit {

  // 接收父组件传入的初始背景配置
  @Input() initialContentConfig: ContentProps = {
    text: '请输入内容',
    fontColor: '', // 颜色 
    fontWeight: 'normal', // 字体 (常规或加粗) 
    fontSize: '', // 字体大小 
    align: 'left', // 对齐 
    maxLines: 1, // 最大行数 (最多5行) 
    loopRender: false, // 循环渲染 (高级设置) 
  };

  // 向父组件发出布局配置变化的事件
  @Output() configChange = new EventEmitter<ContentProps>();
  // ----- 内部状态管理 -----
  text: string = '请输入内容';
  fontColor: string = ''; // 颜色 
  fontWeight: 'normal' | 'bold' = 'normal'; // 字体 (常规或加粗) 
  fontSize: string = ''; // 字体大小 
  align: string = 'left'; // 对齐 
  maxLines: number = 1; // 最大行数 (最多5行) 
  loopRender: boolean = false; // 循环渲染 (高级设置) 

  // 下拉框选项
  sizeOptions: { label: string, value: string }[] = [
    { label: '小号', value: ContentFontSize.SMALL },
    { label: '常规', value: ContentFontSize.REGULAR },
    { label: '大号', value: ContentFontSize.LARGE },
  ];

  constructor() { }

  ngOnInit(): void {
    // 根据 initialContentConfig 初始化背景状态
    if (this.initialContentConfig) {
      this.text = this.initialContentConfig.text;
      this.fontColor = this.initialContentConfig.fontColor;
      this.fontWeight = this.initialContentConfig.fontWeight;
      this.fontSize = this.initialContentConfig.fontSize;
      this.align = this.initialContentConfig.align;
      this.maxLines = this.initialContentConfig.maxLines;
      this.loopRender = this.initialContentConfig.loopRender;
    }

    this.emitConfig();
  }

  /**
 * 处理颜色选择器变化
 * @param value 选中的颜色值
 */
  onColorChange(value: string): void {
    this.fontColor = value;
    this.emitConfig();
  }

  onFontWeightChange(value: 'normal' | 'bold'): void {
    this.fontWeight = value;
    this.emitConfig();
  }

  onFontSizeChange(value: string): void {
    this.fontSize = value;
    this.emitConfig();
  }

  onAlignChange(value: string): void {
    this.align = value;
    this.emitConfig();
  }

  onMaxlinesChange(value: number): void {
    this.maxLines = value;
    this.emitConfig();
  }

  /**
   * 组合当前所有状态并发出完整的布局配置
   */
  private emitConfig(): void {
    const updatedConfig: ContentProps = {
      text: this.text,
      align: this.align,
      fontColor: this.fontColor,
      fontWeight: this.fontWeight,
      fontSize: this.fontSize,
      maxLines: this.maxLines,
      loopRender: this.loopRender
    };
    this.configChange.emit(updatedConfig);
  }

}
