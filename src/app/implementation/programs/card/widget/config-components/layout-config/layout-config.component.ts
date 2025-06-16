import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { LayoutComponentProps } from '../../../interface';

// 定义插槽配置的接口
export interface SlotConfig {
  id: number; // 用于唯一标识每个槽位，方便删除
  name: string; // 槽位名称，例如 "槽位 1"
}


@Component({
  selector: 'app-layout-config',
  templateUrl: './layout-config.component.html',
  styleUrls: ['./layout-config.component.less']
})

export class LayoutConfigComponent implements OnInit {
  // 接收父组件传入的初始槽位数量
  @Input() initialSlotCount: number = 1;
  // 接收父组件传入的初始背景配置
  @Input() initialLayoutConfig: LayoutComponentProps = {
    slotCount: 1, // 插槽数量 (虽然单列组件默认只有一个插槽，但多列/横滑组件会用到)
    backgroundMode: 'transparent', // 背景模式 (颜色/透明)
    backgroundColor: '#ffffff', // 背景颜色
    rowGap: '', // 行间距 (布局容器内部的行间距)
    padding: '', // 内边距
    borderRadius: '', // 圆角
  };
  // 接收父组件传入的最大槽位数量，默认为 8
  @Input() maxSlots: number = 8;

  // 向父组件发出布局配置变化的事件
  @Output() configChange = new EventEmitter<LayoutComponentProps>();

  // ----- 内部状态管理 -----
  // 插槽列表
  slots: SlotConfig[] = [];
  nextSlotId: number = 1; // 用于生成唯一的槽位 ID

  // 背景相关状态
  selectedOption: string = 'transparent';
  currentRowGap: string = '';
  currentPadding: string = '';
  currentBorderRadius: string = '';
  currentColor: string = '';

  // 下拉框选项，从 0px 到 8px
  spacingOptions: { label: string, value: string }[] = [
    { label: '0px', value: '0px' },
    { label: '4px', value: '4px' },
    { label: '8px', value: '8px' },
    { label: '12px', value: '12px' },
    { label: '16px', value: '16px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
  ]

  constructor() { }

  ngOnInit(): void {
    // 根据 initialSlotCount 初始化槽位列表
    for (let i = 0; i < this.initialSlotCount; i++) {
      this.slots.push({ id: this.nextSlotId++, name: `槽位 ${i + 1}` });
    }

    // 根据 initialLayoutConfig 初始化背景状态
    if (this.initialLayoutConfig) {
      this.selectedOption = this.initialLayoutConfig.backgroundMode;
      this.currentRowGap = this.initialLayoutConfig.rowGap;
      this.currentPadding = this.initialLayoutConfig.padding;
      this.currentBorderRadius = this.initialLayoutConfig.borderRadius;
      this.currentColor = this.initialLayoutConfig.backgroundColor;
    }

    this.emitConfig();
  }
  /**
   * 添加新槽位
   */
  addSlot(): void {
    if (this.slots.length < this.maxSlots) {
      const newSlot: SlotConfig = {
        id: this.nextSlotId++,
        name: `槽位 ${this.slots.length + 1}`
      };
      this.slots.push(newSlot);
      this.emitConfig();
    } else {
      console.warn(`最多只能添加 ${this.maxSlots} 个槽位。`);
    }
  }

  /**
   * 删除指定槽位
   * @param slotToDelete 要删除的槽位对象
   */
  deleteSlot(slotToDelete: SlotConfig): void {
    this.slots = this.slots.filter(slot => slot.id !== slotToDelete.id);
    // 重新编号槽位名称，使其保持连续性
    this.slots.forEach((slot, index) => {
      slot.name = `槽位 ${index + 1}`;
    });
    this.emitConfig();
  }

  // ----- 背景相关方法 (与 background-config 组件中的逻辑相同) -----

  onOptionChange(value: string): void {
    this.selectedOption = value;
    this.emitConfig();
  }

  onLineHeightChange(value: string): void {
    this.currentRowGap = value;
    this.emitConfig();
  }

  onPaddingChange(value: string): void {
    this.currentPadding = value;
    this.emitConfig();
  }

  onBorderRadiusChange(value: string): void {
    this.currentBorderRadius = value;
    this.emitConfig();
  }

  onColorChange(value: string): void {
    this.currentColor = value;
    this.emitConfig();
  }

  /**
   * 组合当前所有状态并发出完整的布局配置
   */
  private emitConfig(): void {
    const updatedConfig: LayoutComponentProps = {
      backgroundMode: this.selectedOption,
      slotCount: this.slots.length,
    };

    if (this.selectedOption === 'transparent') {
      updatedConfig.rowGap = this.currentRowGap;
      updatedConfig.padding = this.currentPadding;
      updatedConfig.borderRadius = this.currentBorderRadius; // 包含圆角
    } else {
      updatedConfig.backgroundColor = this.currentColor;
    }
    this.configChange.emit(updatedConfig);
  }
}