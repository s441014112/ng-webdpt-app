import { Component, OnChanges, SimpleChanges } from '@angular/core';
import  { Input, Output, EventEmitter } from '@angular/core';

import { ComponentNodeModel, ImageProps } from '../../../interface/index';
import { ImageFixedWidthSize, ImageWidthMode } from '../../../enum';

@Component({
  selector: 'app-image-component',
  templateUrl: './image-component.component.html',
  styleUrls: ['./image-component.component.less']
})
export class ImageComponentComponent implements OnChanges {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 动态计算图片的 nzWidth 和 nzHeight 值，供模板绑定
  calculatedWidth: string | number = '100%';
  calculatedHeight: string | number = 'auto';

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['node']) {
      // 当 node 变化时，重新计算图片尺寸
      this.updateImageDimensions();
    }
  }

  get imageProps(): ImageProps {
    return this.node.props as ImageProps;
  }

  /**
   * 根据 imageProps 计算图片的 nzWidth 和 nzHeight。
   */
  private updateImageDimensions(): void {
    const props = this.imageProps;

    if (props.widthMode === ImageWidthMode.FULL) {
      this.calculatedWidth = '100%';
      this.calculatedHeight = 'auto'; // 宽度铺满时，高度自动
    } else {
      switch (props.fixedWidthSize) {
        case ImageFixedWidthSize.SMALL:
          this.calculatedWidth = 100;
          this.calculatedHeight = 'auto';
          break;
        case ImageFixedWidthSize.NORMAL:
          this.calculatedWidth = 200;
          this.calculatedHeight = 'auto';
          break;
        case ImageFixedWidthSize.LARGE:
          this.calculatedWidth = 300;
          this.calculatedHeight = 'auto';
          break;
        default: 
          this.calculatedWidth = props.customWidth ? Math.min(props.customWidth, 420) : 'auto';
          this.calculatedHeight = props.customHeight ? Math.min(props.customHeight, 800) : 'auto';
          break;
      }
    }
  }

  onComponentClick(event: MouseEvent, component: ComponentNodeModel): void {
    event.stopPropagation(); // 阻止事件冒泡
    this.selectComponent.emit(component);
  }

  isSelected(component: ComponentNodeModel): boolean {
    return this.selectedComponentId === component.id;
  }

}
