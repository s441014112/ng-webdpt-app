import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DividerProps } from '../../../interface';
import { DividerLineType, PaddingSize } from '../../../enum';

@Component({
  selector: 'app-divider-config',
  templateUrl: './divider-config.component.html',
  styleUrls: ['./divider-config.component.less']
})
export class DividerConfigComponent implements OnInit {
  // 接收父组件传入的初始背景配置
  @Input() initialDividerConfig: DividerProps = {
    color: '',
    paddingTop: '',
    paddingBottom: '',
    lineType: '',
  };

  // 向父组件发出布局配置变化的事件
  @Output() configChange = new EventEmitter<DividerProps>();
  // ----- 内部状态管理 -----
  color: string = '';
  paddingTop: string = '';
  paddingBottom: string = '';
  lineType: string = '';

  // 下拉框选项
  typeOptions: { label: string, value: string }[] = [
    { label: '直线', value: DividerLineType.SOLID },
    { label: '虚线', value: DividerLineType.DASHED },
    { label: '点线', value: DividerLineType.DOTTED },
  ];

  // 下拉框选项，从 0px 到 8px
  spacingOptions: { label: string, value: string }[] = [
    { label: '无', value: PaddingSize.NONE },
    { label: '小', value: PaddingSize.SMALL },
    { label: '中', value: PaddingSize.MEDIUM },
    { label: '大', value: PaddingSize.LARGE },
  ]

  constructor() { }

  ngOnInit(): void {
    // 根据 initialDividerConfig 初始化背景状态
    if (this.initialDividerConfig) {
      this.color = this.initialDividerConfig.color;
      this.paddingTop = this.initialDividerConfig.paddingTop;
      this.paddingBottom = this.initialDividerConfig.paddingBottom;
      this.lineType = this.initialDividerConfig.lineType;
    }

    this.emitConfig();
  }

  /**
  * 处理颜色选择器变化
  * @param value 选中的颜色值
  */
  onColorChange(value: string): void {
    this.color = value;
    this.emitConfig();
  }

  onPaddingTopChange(value: string): void {
    this.paddingTop = value;
    this.emitConfig();
  }

  onPaddingBottomChange(value: string): void {
    this.paddingBottom = value;
    this.emitConfig();
  }

  onTypeChange(value: string): void {
    this.lineType = value;
    this.emitConfig();
  }

  /**
   * 组合当前所有状态并发出完整的布局配置
   */
  private emitConfig(): void {
    const updatedConfig: DividerProps = {
      color: this.color,
      paddingBottom: this.paddingBottom,
      paddingTop: this.paddingTop,
      lineType: this.lineType,
    };
    this.configChange.emit(updatedConfig);
  }


}
