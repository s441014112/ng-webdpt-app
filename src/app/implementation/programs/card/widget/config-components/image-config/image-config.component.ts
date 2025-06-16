import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageProps } from '../../../interface';

@Component({
  selector: 'app-image-config',
  templateUrl: './image-config.component.html',
  styleUrls: ['./image-config.component.less']
})
export class ImageConfigComponent implements OnInit {

  // 接收父组件传入的初始背景配置
  @Input() initialImageConfig: ImageProps = {
    src: '',
    widthMode: 'full',
    fixedWidthSize: '',
    customWidth: 0,
    customHeight: 0,
    loopRender: false
  };

  // 向父组件发出布局配置变化的事件
  @Output() configChange = new EventEmitter<ImageProps>();
  // ----- 内部状态管理 -----
  widthMode: 'full' | 'fixed' = 'full';
  fixedWidthSize: string = '';
  customWidth: number = 80;
  customHeight: number = 80;
  loopRender: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // 根据 initialImageConfig 初始化背景状态
    if (this.initialImageConfig) {
      this.widthMode = this.initialImageConfig.widthMode;
      this.fixedWidthSize = this.initialImageConfig.fixedWidthSize;
      this.customWidth = this.initialImageConfig.customWidth;
      this.customHeight = this.initialImageConfig.customHeight;
      this.loopRender = this.initialImageConfig.loopRender;
    }

    this.emitConfig();
  }

  onWidthModeChange(value: 'full' | 'fixed'): void {
    this.widthMode = value;
    this.emitConfig();
  }

  onSizeChange(value: string): void {
    this.fixedWidthSize = value;
    this.emitConfig();
  }

  onWidthChange(value: number): void {
    this.customWidth = value;
    this.emitConfig();
  }

  onHeightChange(value: number): void {
    this.customHeight = value;
    this.emitConfig();
  }

  /**
   * 组合当前所有状态并发出完整的布局配置
   */
  private emitConfig(): void {
    const updatedConfig: ImageProps = {
      src: 'assets/template/IMAGE.png',
      widthMode: this.widthMode,
      fixedWidthSize: this.fixedWidthSize,
      customWidth: this.customWidth,
      customHeight: this.customHeight,
    };
    this.configChange.emit(updatedConfig);
  }


}
