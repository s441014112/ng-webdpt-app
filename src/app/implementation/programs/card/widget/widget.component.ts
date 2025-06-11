import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router'

import * as uuid from 'uuid';

import { ComponentNodeModel, RootProps } from '../interface';
import { COMPONENT_TYPE } from '../enum';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.less']
})


export class WidgetComponent implements OnInit {
  /**
   * 路由参数
   * @param templateId 模板ID
   * @param templateName 模板名称
   */
  templateId: string = '';
  templateName: string = '';

  // 布局组件
  containerComponents = [
    { type: COMPONENT_TYPE.SINGLE_COLUMN, name: '单列' },
    { type: COMPONENT_TYPE.MULTI_COLUMN, name: '多列' },
    { type: COMPONENT_TYPE.HORIZONTAL, name: '横滑' },
    { type: COMPONENT_TYPE.LIST, name: '列表' },
  ];

  // 基础组件
  primitiveComponents = [
    { type: COMPONENT_TYPE.TITLE, name: '标题' },
    { type: COMPONENT_TYPE.CONTENT, name: '内容' },
    { type: COMPONENT_TYPE.DIVIDER, name: '分割线' },
    { type: COMPONENT_TYPE.IMAGE, name: '图片' },
    { type: COMPONENT_TYPE.BUTTON, name: '按钮' },
  ];

  // 左侧可用的组件类型列表
  leftSidebarListIds: string[] = ['container-component-list', 'primitive-component-list'];


  // 左右侧折叠面板是否展开
  showLeftPanel = false;
  showRightPanel = false;

  // 当前画布上所有的组件集合
  canvasItems: ComponentNodeModel[] = [];

  // 整个画布的组件树数据，以 RootComponent 为根
  rootNode: ComponentNodeModel = null;

  // 当前选中的组件节点
  selectedComponent: ComponentNodeModel | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.templateId = params['id'] || '无ID';
      this.templateName = params['name'] || '未命名模板';
    });

    // 初始时画布空白
    this.selectedComponent = null;
  }

  // 新增方法：为画布的 cdkDropListData 提供一个始终有效的数组
  getCanvasDropListData(): ComponentNodeModel[] {
    // 如果 rootNode 存在，则返回其 children；否则返回一个空数组。
    // 这确保了 cdkDropList 始终有一个有效的 data 数组，即使是空的，也能被正确激活。
    return this.rootNode?.children || [];
  }

  isLayoutComponent(type: string): boolean {
    return [COMPONENT_TYPE.SINGLE_COLUMN, COMPONENT_TYPE.MULTI_COLUMN, COMPONENT_TYPE.HORIZONTAL, COMPONENT_TYPE.LIST].includes(type as COMPONENT_TYPE);
  }

  /**
   * 工具方法：在组件树中查找指定ID的组件
   * @param componentId 要查找的组件ID
   * @param currentNode 当前搜索的节点 (递归用)
   * @returns 找到的组件节点及其父节点，或者 null
   */
  findComponentInTree(componentId: string, currentNode: ComponentNodeModel = this.rootNode): { node: ComponentNodeModel, parent: ComponentNodeModel | null } | null {
    if (currentNode.id === componentId) {
      return { node: currentNode, parent: null }; // 根节点无父节点
    }

    if (currentNode.children) {
      for (const child of currentNode.children) {
        if (child.id === componentId) {
          return { node: child, parent: currentNode };
        }
        const found = this.findComponentInTree(componentId, child);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  /**
   * 工具方法：在组件树中查找指定ID的组件（只返回节点）
   * @param componentId 要查找的组件ID
   * @param currentNode 当前搜索的节点 (递归用)
   * @returns 找到的组件节点，或者 null
   */
  getComponentById(componentId: string, currentNode: ComponentNodeModel = this.rootNode): ComponentNodeModel | null {
    if (currentNode.id === componentId) {
      return currentNode;
    }
    if (currentNode.children) {
      for (const child of currentNode.children) {
        const found = this.getComponentById(componentId, child);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }


  /**
   * 处理来自 RootComponent 或其子组件的 selectComponent 事件
   * @param selectedNode 被选中的组件节点
   */
  onSelectComponent(selectedNode: ComponentNodeModel): void {
    console.log('Component selected:', selectedNode.name, selectedNode.id);
    this.selectedComponent = selectedNode;
  }

  /**
   * 处理添加组件事件
   * @param event 包含父节点、要添加的组件类型和可选索引
   */
  onAddComponent(event: { parent: ComponentNodeModel, componentType: COMPONENT_TYPE, index?: number }): void {
    console.log('Add component event received:', event);

    // 从实际的组件树中查找父节点，而不是直接使用传入的 event.parent
    // 这是为了确保操作的是当前最新状态的组件树
    const parentNodeResult = this.findComponentInTree(event.parent.id);
    if (!parentNodeResult || !parentNodeResult.node) {
      console.error('Parent node not found for addComponent:', event.parent.id);
      return;
    }
    const parentNode = parentNodeResult.node;

    // 确保父节点有 children 数组
    if (!parentNode.children) {
      parentNode.children = [];
    }

    // 根据组件类型创建新的组件节点
    const newComponent: ComponentNodeModel = this.createNewComponentNode(event.componentType);

    if (newComponent) {
      if (event.index !== undefined && event.index >= 0 && event.index <= parentNode.children.length) {
        parentNode.children.splice(event.index, 0, newComponent);
      } else {
        parentNode.children.push(newComponent);
      }
      this.selectedComponent = newComponent;
      // 触发变更检测
      this.rootNode = { ...this.rootNode! };
      console.log('New component added:', newComponent);
    }
  }

  /**
   * 处理删除组件事件
   * @param event 包含要删除的父节点和子节点
   */
  onDeleteComponent(event: { parent: ComponentNodeModel | null, componentToDelete: ComponentNodeModel }): void {
    console.log('Delete component event received:', event);

    let targetParentNode: ComponentNodeModel | null = null;

    if (event.parent) {
      const parentNodeResult = this.findComponentInTree(event.parent.id);
      if (parentNodeResult) {
        targetParentNode = parentNodeResult.node;
      }
    } else if (event.componentToDelete.id === this.rootNode.id) {
        // 如果要删除的是根节点，通常不允许，或者有特殊处理
        console.warn('Attempted to delete root node. Operation denied.');
        return;
    }

    if (targetParentNode && targetParentNode.children) {
      const initialLength = targetParentNode.children.length;
      targetParentNode.children = targetParentNode.children.filter(
        child => child.id !== event.componentToDelete.id
      );

      if (targetParentNode.children.length < initialLength) {
        console.log('Component deleted:', event.componentToDelete.id);
        // 如果删除的是当前选中组件，则选中其父组件或根组件
        if (this.selectedComponent?.id === event.componentToDelete.id) {
          this.selectedComponent = targetParentNode; // 选中父组件
        }
        this.rootNode = { ...this.rootNode }; // 浅拷贝触发Angular变更检测
      } else {
        console.warn('Component to delete not found in parent children:', event.componentToDelete.id);
      }
    } else {
      console.warn('Parent node not found or has no children for deleteComponent:', event.parent?.id);
    }
  }

  /**
   * 处理更新组件属性事件
   * @param event 包含组件ID和新的属性
   */
  onUpdateComponentProps(event: { componentId: string, newProps: Partial<any> }): void {
    console.log('Update props event received:', event);
    const componentToUpdate = this.getComponentById(event.componentId);
    if (componentToUpdate) {
      componentToUpdate.props = { ...componentToUpdate.props, ...event.newProps };
      console.log('Component props updated:', componentToUpdate.id, componentToUpdate.props);
      this.rootNode = { ...this.rootNode }; // 浅拷贝触发Angular变更检测
    } else {
      console.warn('Component not found for updateComponentProps:', event.componentId);
    }
  }

  /**
   * 处理复制组件事件
   * @param componentToCopy 要复制的组件节点
   */
  onCopyComponent(componentToCopy: ComponentNodeModel): void {
    console.log('Copy component event received:', componentToCopy);

    const result = this.findComponentInTree(componentToCopy.id);
    if (!result) {
      console.error('Component to copy not found in tree:', componentToCopy.id);
      return;
    }
    const { node: originalNode, parent: parentNode } = result;

    if (!parentNode || !parentNode.children) {
      console.error('Parent node not found or has no children for copy operation.', originalNode);
      return;
    }

    // 深拷贝原始节点，并为新节点及其所有子节点生成新的UUID
    const copiedNode = this.deepCopyComponentNode(originalNode);
    console.log('Copied node:', copiedNode);

    // 找到原始节点在父节点 children 数组中的索引
    const originalIndex = parentNode.children.findIndex(child => child.id === originalNode.id);

    if (originalIndex !== -1) {
      // 将复制的节点插入到原始节点之后
      parentNode.children.splice(originalIndex + 1, 0, copiedNode);
      this.selectedComponent = copiedNode; // 选中新复制的组件
      this.rootNode = { ...this.rootNode }; // 浅拷贝触发Angular变更检测
      console.log('Component copied:', copiedNode.id);
    } else {
      console.error('Original component not found in parent children for copy operation.');
    }
  }

  /**
   * 递归深拷贝组件节点，并为所有节点生成新的UUID
   * @param node 要拷贝的原始节点
   * @returns 拷贝后的新节点
   */
  private deepCopyComponentNode(node: ComponentNodeModel): ComponentNodeModel {
    const newNode: ComponentNodeModel = {
      ...node,
      id: this.generateId(), // 生成新的ID
      children: [] // 先清空 children，再递归复制
    };

    // 确保 props 也是深拷贝，避免引用问题
    if (node.props) {
        newNode.props = JSON.parse(JSON.stringify(node.props));
    }


    if (node.children && node.children.length > 0) {
      newNode.children = node.children.map(child => this.deepCopyComponentNode(child));
    }
    return newNode;
  }


  /**
   * 创建一个新的组件节点，带默认属性和ID
   * @param type 组件类型
   * @returns 新的组件节点
   */
  private createNewComponentNode(type: COMPONENT_TYPE): ComponentNodeModel {
    const newId = this.generateId();
    let defaultProps: Record<string, any> = {};
    let children: ComponentNodeModel[] = [];
    let name: string = '';

    switch (type) {
      case COMPONENT_TYPE.SINGLE_COLUMN:
        name = '单列布局';
        defaultProps = {
          backgroundColor: '#ffffff', padding: '8px', rowGap: '8px', borderRadius: '0px'
        };
        children = [this.createNewComponentNode(COMPONENT_TYPE.SLOT)]; // 默认包含一个插槽
        break;
      case COMPONENT_TYPE.MULTI_COLUMN:
        name = '多列布局';
        defaultProps = {
          backgroundColor: '#ffffff', padding: '8px', rowGap: '8px', borderRadius: '0px'
        };
        children = [
          this.createNewComponentNode(COMPONENT_TYPE.SLOT),
          this.createNewComponentNode(COMPONENT_TYPE.SLOT),
          this.createNewComponentNode(COMPONENT_TYPE.SLOT)
        ]; // 默认包含三个插槽
        break;
      case COMPONENT_TYPE.HORIZONTAL:
        name = '横向滑动';
        defaultProps = {
          backgroundColor: '#ffffff', padding: '8px', borderRadius: '0px'
        };
        children = [
          this.createNewComponentNode(COMPONENT_TYPE.SLOT),
          this.createNewComponentNode(COMPONENT_TYPE.SLOT),
          this.createNewComponentNode(COMPONENT_TYPE.SLOT)
        ]; // 默认包含三个插槽
        break;
      case COMPONENT_TYPE.LIST:
        name = '列表布局';
        defaultProps = {
          backgroundColor: '#ffffff', padding: '8px', rowGap: '8px', borderRadius: '0px'
        };
        children = [
          this.createNewComponentNode(COMPONENT_TYPE.SINGLE_COLUMN),
          this.createNewComponentNode(COMPONENT_TYPE.SINGLE_COLUMN),
          this.createNewComponentNode(COMPONENT_TYPE.SINGLE_COLUMN)
        ]; // 默认包含三个单列组件
        break;
      case COMPONENT_TYPE.SLOT:
        name = '插槽';
        defaultProps = {
          alignItems: 'flex-start', justifyContent: 'flex-start', rowGap: '4px', padding: '4px'
        };
        children = [];
        break;
      case COMPONENT_TYPE.TITLE:
        name = '标题';
        defaultProps = {
          text: '这是一个标题', fontColor: '#333333', fontSize: '18px', fontWeight: 'bold', align: 'center'
        };
        break;
      case COMPONENT_TYPE.CONTENT:
        name = '内容';
        defaultProps = {
          text: '这是一段文本内容。', fontColor: '#666666', fontSize: '14px', fontWeight: 'normal', align: 'left', maxLines: 0, loopRender: false
        };
        break;
      case COMPONENT_TYPE.DIVIDER:
        name = '分割线';
        defaultProps = {
          color: '#e0e0e0', paddingTop: '8px', paddingBottom: '8px', lineType: 'solid'
        };
        break;
      case COMPONENT_TYPE.IMAGE:
        name = '图片';
        defaultProps = {
          src: 'https://via.placeholder.com/150', widthMode: 'full', fixedWidthSize: '', customWidth: 0, customHeight: 0, loopRender: false
        };
        break;
      case COMPONENT_TYPE.BUTTON:
        name = '按钮';
        defaultProps = {
          buttonType: 'primary', buttonText: '点击按钮', widthMode: 'auto', width: 0, align: 'center', disabledAfterTrigger: false, actionType: 'OPEN_URL', actionValue: ''
        };
        break;
      default:
        console.warn('Unknown component type:', type);
        return null as any; // 返回 null 或抛出错误
    }

    return {
      id: newId,
      type: type,
      name: name,
      props: defaultProps,
      children: children,
    };
  }

  /**
   * 第一次拖拽组件到空白画布时，创建 RootComponent
   */
  private initializeCanvasWithRootComponent(): void {
    if (!this.rootNode) {
      console.log('First component dragged onto canvas. Creating RootComponent.');
      const newRootId = this.generateId();
      this.rootNode = {
        id: newRootId,
        type: COMPONENT_TYPE.ROOT,
        name: 'Root',
        props: {
          backgroundColor: '#ffffff',
          padding: '8px',
          rowGap: '8px',
        } as RootProps,
        children: []
      };
      this.selectedComponent = this.rootNode;
    }
  }

/**
   * 处理拖放事件，无论是从左侧列表拖拽到画布，还是画布内部拖拽。
   * @param event 拖放事件
   */
  onDrop(event: CdkDragDrop<any[]>) {
    // 检查是否是来自左侧组件列表的拖拽
    if (this.leftSidebarListIds.includes(event.previousContainer.id)) {
      const componentType = event.item.data as COMPONENT_TYPE;
      console.log(`Adding new component ${componentType} to canvas at index ${event.currentIndex}`);

      // 确保画布有根组件，如果第一次拖拽，则创建根组件
      this.initializeCanvasWithRootComponent();

      // 获取目标容器的 ID
      const targetContainerId = event.container.id;
      let targetParentNode: ComponentNodeModel | null = null;

      // 如果目标容器是画布的根 DropList (ID为 'canvas-root-drop-list')，则目标父节点是 rootNode
      if (targetContainerId === 'canvas-root-drop-list') {
        targetParentNode = this.rootNode;
      } else {
        // 否则，尝试在组件树中查找对应的组件作为目标父节点
        const foundTarget = this.getComponentById(targetContainerId); // 使用 getComponentById 查找节点
        if (foundTarget) {
          targetParentNode = foundTarget;
          // 进一步检查 targetParentNode 是否是一个允许放置子组件的类型
          if (!this.isDroppableContainer(targetParentNode.type)) {
            console.warn('Cannot drop component into this type of container:', targetParentNode.type);
            return;
          }
        }
      }

      if (targetParentNode) {
        this.onAddComponent({
          parent: targetParentNode,
          componentType: componentType,
          index: event.currentIndex
        });
      } else {
        console.warn('Could not determine a valid target parent node for the dropped component.');
      }

    } else {
      // 这是画布内部的拖拽 (从一个容器到另一个容器，或在同一个容器内排序)
      console.log('Internal canvas drop event:', event);

      // 获取源和目标容器对应的组件节点
      const previousContainerNode = this.getComponentById(event.previousContainer.id);
      const currentContainerNode = this.getComponentById(event.container.id);

      if (!previousContainerNode || !previousContainerNode.children) {
        console.warn('Previous container node not found or has no children for internal drop.');
        return;
      }

      if (!currentContainerNode || !currentContainerNode.children) {
        console.warn('Current container node not found or has no children for internal drop.');
        return;
      }

      // 检查目标容器是否允许接收组件
      if (!this.isDroppableContainer(currentContainerNode.type)) {
        console.warn('Target container does not allow dropping components:', currentContainerNode.type);
        return;
      }

      if (event.previousContainer === event.container) {
        // 在同一个容器内排序
        moveItemInArray(previousContainerNode.children, event.previousIndex, event.currentIndex);
        console.log(`Reordered components in container ${previousContainerNode.id}.`);
      } else {
        // 从一个容器移动到另一个容器
        transferArrayItem(
          previousContainerNode.children,
          currentContainerNode.children,
          event.previousIndex,
          event.currentIndex
        );
        console.log(`Transferred component from ${previousContainerNode.id} to ${currentContainerNode.id}.`);
      }

      this.rootNode = { ...this.rootNode! }; // 触发变更检测
    }
  }

  // 辅助方法：判断组件类型是否是一个可以接收子组件的容器
  isDroppableContainer(type: string): boolean {
    return [
        "ROOT",
        "SINGLE_COLUMN",
        "MULTI_COLUMN",
        "HORIZONTAL",
        "LIST",
        "SLOT"
    ].includes(type);
  }

  // --- 属性面板相关 ---
  get jsonOutput(): string {
    return JSON.stringify(this.rootNode, null, 2);
  }

  // 生成唯一 ID
  generateId(): string {
    return uuid.v4();
  }

  saveTemplate(): void {
    console.log('保存模板');
  }

}


