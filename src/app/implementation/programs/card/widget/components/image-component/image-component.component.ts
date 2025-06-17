import { Component, OnInit, SimpleChanges } from '@angular/core';
import  { Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';


import { ComponentNodeModel, ImageProps } from '../../../interface/index';
import { ImageFixedWidthSize, ImageWidthMode } from '../../../enum';

@Component({
  selector: 'app-image-component',
  templateUrl: './image-component.component.html',
  styleUrls: ['./image-component.component.less'],
  host: {
    '[style.display]': '"contents"',
  }
})

export class ImageComponentComponent implements OnInit {

  @Input() node!: ComponentNodeModel;
  @Input() selectedComponentId: string | null = null;
  @Output() selectComponent = new EventEmitter<ComponentNodeModel>();

  // 新增：接收所有画布内部可连接的 DropList ID 集合 (即使不使用，也需要接收以保持接口一致性)
  @Input() allCanvasDropListIds: string[] = [];
  // 新增：用于将拖放事件向上冒泡 (即使不作为容器，也需要有这个 Output 以便 ComponentRenderer 能够订阅)
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();

  width:  string | number = 60;
  height: string | number = 60;

  constructor() { }

  ngOnInit(): void {
    this.width = this.calculatedWidth();
    this.height = this.calculatedHeight();
    console.log('image-component-component.width:', this.width, 'ngOnInit: this.node: height', this.height);
  }

  get imageProps(): ImageProps {
    return this.node.props as ImageProps;
  }

  calculatedWidth(): string | number {
    let result
    if (this.node.props.widthMode === ImageWidthMode.FULL) {
      result = '100%';
    } else {
      switch (this.node.props.fixedWidthSize) {
        case ImageFixedWidthSize.SMALL:
          result = 60;
          break;
        case ImageFixedWidthSize.NORMAL:
          result = 80;
          break;
        case ImageFixedWidthSize.LARGE:
          result = 100;
          break;
        default:
          result = this.node.props.customWidth ? Math.min(this.node.props.customWidth, 420) : 60;
          break;
      }
    }
    return result;
  }

  calculatedHeight(): string {
    let result
    if (this.node.props.widthMode === ImageWidthMode.FULL) {
      result = '100%';
    } else {
      switch (this.node.props.fixedWidthSize) {
        case ImageFixedWidthSize.SMALL:
          result = 60;
          break;
        case ImageFixedWidthSize.NORMAL:
          result = 80;
          break;
        case ImageFixedWidthSize.LARGE:
          result = 100;
          break;
        default:
          result = this.node.props.customHeight ? Math.min(this.node.props.customHeight, 800) : 60;
          break;
      }
    }
    return result;
  }


  onComponentClick(event: MouseEvent, component: ComponentNodeModel): void {
    event.stopPropagation();
    this.selectComponent.emit(component);
  }

  isSelected(component: ComponentNodeModel): boolean {
    return this.selectedComponentId === component.id;
  }

  /**
   * 对于基础组件，这个方法通常不会被实际调用来处理 drop 事件，
   * 但为了与 ComponentRenderer 的接口一致性，它需要存在。
   * @param event 拖放事件对象
   */
  onImageDrop(event: CdkDragDrop<any>): void {
    // 基础组件通常不会接收拖放，所以这里可以为空或添加日志
    // console.log('Image component drop event (should not happen usually):', event);
    this.dropEvent.emit(event); // 仍然向上冒泡，以防万一
  }
}