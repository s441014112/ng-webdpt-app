import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router'

import * as uuid from 'uuid';

import { ComponentNode } from '../interface';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.less']
})
export class WidgetComponent implements OnInit {

  // 左右侧折叠面板是否展开
  showLeftPanel = false;
  showRightPanel = false;

  /**
   * 路由参数
   * @param templateId 模板ID
   * @param templateName 模板名称
   */
  templateId: string = '';
  templateName: string = '';

  // 布局组件
  containerComponents = [
    { type: 'SINGLE_COLUMN', name: '单列' },
    { type: 'MULTI_COLUMN', name: '多列' },
    { type: 'HORIZONTAL', name: '横滑' },
    { type: 'LIST', name: '列表' },
  ];

  // 基础组件
  primitiveComponents = [
    { type: 'TITLE', name: '标题' },
    { type: 'CONTENT', name: '内容' },
    { type: 'DIVIDER', name: '分割线' },
    { type: 'IMAGE', name: '图片' },
    { type: 'BUTTON', name: '按钮' },
  ];

  canvasItems: Array<ComponentNode> = [];
  selectedItem: ComponentNode | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.templateId = params['id'] || '无ID';
      this.templateName = params['name'] || '未命名模板';
    });
  }

  // 添加组件到画布
  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.canvasItems, event.previousIndex, event.currentIndex);
    } else {
      const newItem: ComponentNode = {
        id: this.generateId(),
        name: event.item.data,
        type: event.item.data,
        children: []
      };
      this.canvasItems.push(newItem);
      this.selectItem(newItem);
    }
  }

  // 添加子组件
  dropInChild(event: CdkDragDrop<any>, parentId: number) {
    const parent = this.canvasItems[parentId];
    if (parent && parent.children) {
      const newItem: ComponentNode = {
        id: this.generateId(),
        name: event.item.data,
        type: event.item.data,
        children: []
      };
      parent.children.push(newItem);
      this.selectItem(newItem);
    }
  }

  // 在指定位置后插入一个与当前组件类型相同的组件（点击 +）
  addSameComponent(index: number, event: Event) {
    event.stopPropagation();

    const newItem: ComponentNode = {
      id: this.generateId(),
      name: this.canvasItems[index].type,
      type: this.canvasItems[index].type,
      children: []
    };

    // 插入到当前组件的下一个位置
    this.canvasItems.splice(index + 1, 0, newItem);
    this.selectItem(newItem); // 自动选中新组件
  }

  // 删除组件（点击 -）
  removeItem(index: number, event: Event) {
    event.stopPropagation();
    this.canvasItems.splice(index, 1);
    this.selectedItem = null;
  }

  // 生成唯一 ID
  generateId(): string {
    return uuid.v4();
  }

  // 点击选中组件
  selectItem(item: ComponentNode): void {
    this.selectedItem = item;
  }

  saveTemplate(): void {
    console.log('保存模板');
  }
}


