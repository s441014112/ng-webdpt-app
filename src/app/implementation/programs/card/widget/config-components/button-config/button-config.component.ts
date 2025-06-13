import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ButtonProps } from '../../../interface';

@Component({
  selector: 'app-button-config',
  templateUrl: './button-config.component.html',
  styleUrls: ['./button-config.component.less']
})
export class ButtonConfigComponent implements OnInit {
  // 接收父组件传入的初始背景配置
  @Input() initialButtonConfig: ButtonProps = {
    buttonType: '',
    buttonText: '按钮',
    widthMode: 'auto', // 宽度模式 
    width: 100, // 固定宽度时的值 
    align: '', // 对齐方式 
    disabledAfterTrigger: false, // 触发后是否禁用 
    actionType: 'CALL_PLUGIN', // 按钮操作 
  };

  // 向父组件发出布局配置变化的事件
  @Output() configChange = new EventEmitter<ButtonProps>();
  // ----- 内部状态管理 -----
  buttonType: string ='';
  buttonText: string = '按钮';
  widthMode: 'auto' | 'stretch' | 'fixed' = 'auto'; // 宽度模式 
  width: number = 100; // 固定宽度时的值 
  align: string = ''; // 对齐方式 
  disabledAfterTrigger: boolean =  false; // 触发后是否禁用 
  actionType: 'CALL_PLUGIN' | 'OPEN_URL' =  'CALL_PLUGIN'; // 按钮操作 

  // 下拉框选项
  actionOptions: string[] = ['CALL_PLUGIN', 'OPEN_URL'];
  typeOptions: { label: string, value: string }[] = [
    { label: '主要按钮', value: 'primary' },
    { label: '次要按钮', value: 'default' },
    { label: '三级按钮', value: 'dashed' },
    { label: '四级按钮', value: 'link' },
    { label: '文字按钮', value: 'text' },
    { label: '警告按钮', value: 'danger' },
  ];

  constructor() { }

  ngOnInit(): void {
    // 根据 initialButtonConfig 初始化背景状态
    if (this.initialButtonConfig) {
      this.buttonType = this.initialButtonConfig.buttonType;
      this.buttonText = this.initialButtonConfig.buttonText || '按钮';
      this.widthMode = this.initialButtonConfig.widthMode;
      this.width = this.initialButtonConfig.width;
      this.align = this.initialButtonConfig.align;
      this.disabledAfterTrigger = this.initialButtonConfig.disabledAfterTrigger;
      this.actionType = this.initialButtonConfig.actionType;
    }

    this.emitConfig();
  }

  onTypeChange(value: string): void {
    this.buttonType = value;
    this.emitConfig();
  }

  onWidthModeChange(value: 'auto' | 'stretch' | 'fixed'): void {
    this.widthMode = value;
    this.emitConfig();
  }

  onAlignChange(value: string): void {
    this.align = value;
    this.emitConfig();
  }

  onSwitchChange(value: boolean): void {
    this.disabledAfterTrigger = value;
    this.emitConfig();
  }

  onActionChange(value: 'CALL_PLUGIN' | 'OPEN_URL'): void {
    this.actionType = value;
    this.emitConfig();
  }

  /**
   * 组合当前所有状态并发出完整的布局配置
   */
  private emitConfig(): void {
    const updatedConfig: ButtonProps = {
      buttonType: this.buttonType,
      buttonText: this.buttonText || '按钮',
      widthMode: this.widthMode,
      align: this.align,
      disabledAfterTrigger: this.disabledAfterTrigger,
      actionType: this.actionType,
    };
    if (this.widthMode === 'fixed') {
      updatedConfig.width = this.width;
    }
    this.configChange.emit(updatedConfig);
  }

}
