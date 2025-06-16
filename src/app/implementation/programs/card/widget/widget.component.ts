import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router'

import * as uuid from 'uuid';

import { ComponentNodeModel, RootProps, SingleColumnProps, MultiColumnProps, HorizontalProps, ListProps, SlotProps, TitleProps, ContentProps, DividerProps, ImageProps, ButtonProps } from '../interface';
import { COMPONENT_TYPE, ButtonType, ButtonWidthMode, ContentFontSize, DividerLineType, ImageFixedWidthSize, ImageWidthMode, AlignType, ButtonActionType, TextAlignType, BackgroundMode } from '../enum'; // 确保导入所有必要的枚举

interface Color {
  text: string;
  value: string;
  label?: string;
  label1?: string;
}
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

  // 画布中的根节点
  rootNode: ComponentNodeModel | null = null;
  // 当前选中的组件
  selectedComponent: ComponentNodeModel | null = null;

  // 面板显示/隐藏
  showLeftPanel = false;
  showRightPanel = false;

  // 用于在画布中的所有可拖拽区域之间建立连接
  allCanvasDropListIds: string[] = ['canvas-root-drop-list',"container-component-list", "primitive-component-list"];

  showMenu = false;
  menuPosition = { top: '0px', left: '0px' };
  menuItems: { label: string, action: string }[] = [
    {label: '复制', action: 'copy'},
    {label: '删除', action: 'delete'},
  ];


  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.templateId = params['templateId'] || '';
      this.templateName = params['templateName'] || '新建卡片模板';
    });

    // 假设从某个服务加载已有的模板数据
    // this.loadTemplate();
  }

  // 组件选中事件处理
  onSelectComponent(component: ComponentNodeModel): void {
    this.selectedComponent = component;
    console.log('Selected Component:', this.selectedComponent);

    // Root组件不能有右键菜单

    if (this.selectedComponent.type === COMPONENT_TYPE.ROOT) {
      return;
    }

    // 设置菜单位置为点击组件的右上角
    const target = document.getElementById(this.selectedComponent.id) as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    this.menuPosition = {
      top: `${rect.top - 40}px`,
      left: `${rect.right - 70}px`
    };
    
    this.showMenu = true;
  }

  // 保存模板
  saveTemplate(): void {
    console.log('Saving template:', JSON.stringify(this.rootNode, null, 2));
    // 这里可以添加将 this.rootNode 发送到后端保存的逻辑
  }

  /**
   * 创建并初始化 Root 组件。
   * 如果 rootNode 不存在，则创建一个新的 Root 组件。
   */
  createRootComponent(): ComponentNodeModel {
    return {
      id: uuid.v4(),
      type: COMPONENT_TYPE.ROOT,
      name: '根容器',
      props: {
        backgroundMode: BackgroundMode.TRANSPARENT,
        backgroundColor: '#ffffff',
        rowGap: '4px',
        padding: '4px'
      } as RootProps,
      children: []
    };
  }

  // 添加组件到画布 (通过点击左侧组件列表按钮)
  addComponentToCanvas(componentType: COMPONENT_TYPE): void {
    // 如果画布中没有 Root 组件，先创建一个
    if (!this.rootNode) {
      this.rootNode = this.createRootComponent();
      this.updateAllCanvasDropListIds(this.rootNode);
    }

    if (componentType === COMPONENT_TYPE.TITLE) {
      const existingTitle = this.findComponentByType(this.rootNode, COMPONENT_TYPE.TITLE);
      if (existingTitle) {
        alert('画布中已存在标题组件，一个画布只能有一个标题组件。');
        return;
      }
    }

    const newComponent = this.createComponentNode(componentType);

    if (newComponent) {
      if (componentType === COMPONENT_TYPE.TITLE) {
        // 标题组件固定放在 Root 的 children 的最前方
        this.rootNode.children = [newComponent, ...(this.rootNode.children || [])];
      } else {
        // 其他组件添加到 Root 的 children 末尾
        this.rootNode.children = [...(this.rootNode.children || []), newComponent];
      }
      this.selectedComponent = newComponent;
      this.updateAllCanvasDropListIds(this.rootNode);
    }
  }

  // 删除组件
  onDeleteComponent(componentId: string): void {

    this.showMenu = false;

    if (!this.rootNode) return;

    const deleteRecursive = (nodes: ComponentNodeModel[] | undefined, idToDelete: string): ComponentNodeModel[] | undefined => {
      if (!nodes) return undefined;
      return nodes.filter(node => {
        if (node.id === idToDelete) {
          return false;
        }
        if (node.children) {
          node.children = deleteRecursive(node.children, idToDelete);
        }
        return true;
      });
    };

    this.rootNode.children = deleteRecursive(this.rootNode.children, componentId);

    if (this.selectedComponent?.id === componentId) {
      this.selectedComponent = null;
    }

    this.rootNode = { ...this.rootNode! }; // 触发变更检测
    this.updateAllCanvasDropListIds(this.rootNode); // 更新所有可拖拽区域的ID

    // 如果画布上元素删除完了，把画布清空
    if (!this.rootNode.children?.length) {
      this.rootNode = null;
    }
  }

  // 复制组件
  onCopyComponent(componentToCopy: ComponentNodeModel): void {
    this.showMenu = false;

    if (!this.rootNode) return;

    // Title节点不可复制
    if (this.selectedComponent.type === COMPONENT_TYPE.TITLE) {
      alert('画布中已存在标题组件，一个画布只能有一个标题组件。');
      return;
    }

    // 深度复制组件节点
    const copiedComponent = JSON.parse(JSON.stringify(componentToCopy));

    // 为复制的组件及其所有子组件生成新的 UUID
    const assignNewIds = (node: ComponentNodeModel) => {
      node.id = uuid.v4();
      if (node.children) {
        node.children.forEach(child => assignNewIds(child));
      }
    };
    assignNewIds(copiedComponent);

    // 找到原始组件的父级，并将复制的组件添加到其旁边
    const findAndInsert = (nodes: ComponentNodeModel[] | undefined, targetId: string, newComponent: ComponentNodeModel): boolean => {
      if (!nodes) return false;
      const index = nodes.findIndex(node => node.id === targetId);
      if (index !== -1) {
        nodes.splice(index + 1, 0, newComponent);
        return true;
      }
      for (const node of nodes) {
        if (node.children && findAndInsert(node.children, targetId, newComponent)) {
          return true;
        }
      }
      return false;
    };

    if (findAndInsert(this.rootNode.children, componentToCopy.id, copiedComponent)) {
      this.rootNode = { ...this.rootNode! }; // 触发变更检测
      this.selectedComponent = copiedComponent; // 选中复制的组件
      this.updateAllCanvasDropListIds(this.rootNode); // 更新所有可拖拽区域的ID
    } else {
      console.warn('Could not find the component to copy in the tree.');
    }
  }


  // 更新组件属性
  onUpdateComponentProps(updatedProps: { id: string, props: Record<string, any> }): void {
    if (!this.rootNode) return;

    const updateRecursive = (nodes: ComponentNodeModel[] | undefined): boolean => {
      if (!nodes) return false;
      for (const node of nodes) {
        if (node.id === updatedProps.id) {
          node.props = { ...node.props, ...updatedProps.props };
          this.rootNode = { ...this.rootNode! }; // 触发变更检测
          this.selectedComponent = node; // 更新选中组件的属性
          return true;
        }
        if (node.children && updateRecursive(node.children)) {
          return true;
        }
      }
      return false;
    };

    updateRecursive(this.rootNode.children);
  }

  /**
   * 拖放事件处理
   * @param event CdkDragDrop 事件对象
   */
  onDrop(event: CdkDragDrop<ComponentNodeModel[]>): void {
    console.log('Drop event triggered:', event);
    console.log('Previous container:', event.previousContainer.id);
    console.log('Current container:', event.container.id);
    console.log('Dragged data:', event.item.data);
    console.log(this.allCanvasDropListIds);
    console.log('rootNode:', !!this.rootNode);

    // 若结束节点为画布，且画布上没有Root组件，创建初始化Root组件并添加到画布上作为最底层容器。
    if (!this.rootNode) {
      this.rootNode = this.createRootComponent();
      this.updateAllCanvasDropListIds(this.rootNode);
      console.log('Root component created and added to canvas.');
    }

    // 获取鼠标释放时的坐标 { x, y }
    const dropPoint = event.dropPoint; 
    let actualTargetContainerId: string | null = null;
    // 获取所有可能的画布内部拖放目标（通过 ID 获取 DOM 元素）
    const potentialCanvasDropTargets: { id: string, element: HTMLElement }[] = [];
    for (const id of this.allCanvasDropListIds) {
      // 排除左侧面板的组件列表，它们不是画布上的放置目标
      if (id === 'container-component-list' || id === 'primitive-component-list') {
        continue;
      }
      const element = document.getElementById(id);
      if (element) {
        potentialCanvasDropTargets.push({ id, element });
      }
    }

    // 遍历所有潜在目标，通过坐标判断最精确的目标
    let bestMatchId: string | null = null;
    let bestMatchArea: number = Infinity;
    // 遍历所有可能的画布内部拖放目标
    for (const target of potentialCanvasDropTargets) {
        const rect = target.element.getBoundingClientRect();

        // 检查鼠标坐标是否在当前元素的范围内
        if (
            dropPoint.x >= rect.left &&
            dropPoint.x <= rect.right &&
            dropPoint.y >= rect.top &&
            dropPoint.y <= rect.bottom
        ) {
            // 如果鼠标在范围内，考虑这是潜在目标。
            // 如果有多个重叠的区域，选择面积最小的那个（通常意味着更具体的嵌套目标）
            const currentArea = rect.width * rect.height;
            if (currentArea < bestMatchArea) {
                bestMatchArea = currentArea;
                bestMatchId = target.id;
            }
        }
    }
    // 如果通过坐标找到了最佳匹配
    actualTargetContainerId = bestMatchId || event.container.id;

    const draggedData = event.item.data;
    const draggedType = typeof draggedData === 'string' ? draggedData : draggedData.type; 

    // 1. 获取初始节点信息，获取结束节点信息
    // currentContainerId 是当前鼠标所在的 drop list 的 ID
    let currentContainerId = actualTargetContainerId;
    // previousContainerId 是被拖动元素原始所在的 drop list 的 ID
    const previousContainerId = event.previousContainer.id;

    // 找到目标容器节点
    let currentContainerNode: ComponentNodeModel | null = null;
    if (currentContainerId === 'canvas-root-drop-list') {
      currentContainerNode = this.rootNode;
      currentContainerId = this.rootNode.id;
    } else {
      currentContainerNode = this.findComponentNodeById(this.rootNode, currentContainerId);
    }


    // 阻止 Root 组件被拖动 (规则 1)
    if (draggedData.type === COMPONENT_TYPE.ROOT) {
      console.warn('组件不可拖动');
      return;
    }
    // 阻止 Title 组件被拖动 (规则 8)
    if (draggedData.type === COMPONENT_TYPE.TITLE) {
      return;
    }

    // 判断初始节点来源
    if (event.previousContainer.id === 'container-component-list' || event.previousContainer.id === 'primitive-component-list') {

      // 4. 若组件类型为Title, 查询画布中是否已存在Title组件，若有则不得再拖入
      if (draggedType === COMPONENT_TYPE.TITLE) {
        if (this.findComponentByType(this.rootNode, COMPONENT_TYPE.TITLE)) {
          alert('画布中已存在标题组件，一个画布只能有一个标题组件。');
          return;
        }
      }

      // 创建新组件节点
      const newComponentNode = this.createComponentNode(draggedType as COMPONENT_TYPE);
      if (!newComponentNode) {
        console.error('创见组件失败.');
        return;
      }

      // 放置规则判断
      let fromType = newComponentNode.type as COMPONENT_TYPE;
      let toType = currentContainerNode.type as COMPONENT_TYPE;
      if (!this.canDropNewComponent(fromType, toType)) {
        console.warn(`Cannot drop ${newComponentNode.type} into ${currentContainerNode.type}.`);
        return;
      }

      // 4. 若结束节点为Root组件，创建初始节点对应类型的组件，添加至Root组件children末尾
      if (currentContainerNode.type === COMPONENT_TYPE.ROOT) {
        if (newComponentNode.type === COMPONENT_TYPE.TITLE) {
          // 标题组件固定放在 Root 的 children 的最前方
          this.rootNode!.children = [newComponentNode, ...(this.rootNode!.children || [])];
        } else {
          // 其他组件添加到 Root 的 children 末尾
          this.rootNode!.children = [...(this.rootNode!.children || []), newComponentNode];
        }
      }
      // 5. 若结束节点为Slot组件，判断初始节点对应类型的组件，添加至Slot组件children末尾
      else if (currentContainerNode.type === COMPONENT_TYPE.SLOT) {
        currentContainerNode.children = [...(currentContainerNode.children || []), newComponentNode];
      }
      // 如果目标是布局组件本身 (SINGLE_COLUMN, MULTI_COLUMN, HORIZONTAL, LIST)，则不允许直接放置内容组件
      else if (this.isLayoutComponent(currentContainerNode.type)) {
        return;
      }

      this.selectedComponent = newComponentNode;
      this.rootNode = { ...this.rootNode! }; // 触发变更检测
      this.updateAllCanvasDropListIds(this.rootNode); // 更新所有可拖拽区域的ID
    } else {
      // 6. 初始节点来源为画布中 (表明组件要在画布上拖拽排序)
      console.log('画布中拖拽排序');

      // 获取被拖动节点和其父节点
      const draggedNode = event.item.data as ComponentNodeModel;
      const previousContainerNode = this.findComponentNodeById(this.rootNode, previousContainerId);

      if (!draggedNode || !previousContainerNode || !previousContainerNode.children) {
        console.warn('出错了没找到节点');
        return;
      }

      // 放置规则判断
      if (!this.canDropExistingComponent(draggedNode, currentContainerNode)) {
        console.warn(`非法移动${draggedNode.type} 到 ${currentContainerNode.type}.`);
        return;
      }

      // 若初始节点类型为Slot,只能在当前Slot组件的父级布局组件中排序，不可拖动至外侧
      if (draggedNode.type === COMPONENT_TYPE.SLOT) {
        // 验证拖动范围，SLOT 只能在布局组件内移动
        if (!this.isLayoutComponent(previousContainerNode.type) || !this.isLayoutComponent(currentContainerNode.type)) {
          console.warn('SLOT只能在布局组件内部移动！！');
          return;
        }
        if (event.previousContainer.id === currentContainerId) {
          const currentIndex = this.calculateCurrentIndexY(dropPoint, currentContainerNode.children);
          // 在同一个容器内排序
          moveItemInArray(previousContainerNode.children, event.previousIndex, currentIndex);
          this.updateAllCanvasDropListIds(this.rootNode);
        }
        return;
      }
      // 若初始节点类型为其他内容组件，可以在 SLOT 内部移动（排序），也可以从一个 SLOT 移动到另一个 SLOT，也可以从一个Slot拖动到Root组件下面
      else if (this.isContentComponent(draggedNode.type)) {
        // 检查源和目标容器是否符合规则 (SLOT 或 ROOT)
        const isPreviousSlotOrRoot = previousContainerNode.type === COMPONENT_TYPE.SLOT || previousContainerNode.type === COMPONENT_TYPE.ROOT;
        const isCurrentSlotOrRoot = currentContainerNode.type === COMPONENT_TYPE.SLOT || currentContainerNode.type === COMPONENT_TYPE.ROOT;

        if (!isPreviousSlotOrRoot || !isCurrentSlotOrRoot) {
          console.warn(`内容组件只能SLOT内部或者ROOT组件内部移动`);
          return;
        }

        if (event.previousContainer.id === currentContainerId) {
          // 在同一个容器内排序 (SLOT 或 ROOT)
          const currentIndex = this.calculateCurrentIndexY(dropPoint, currentContainerNode.children);
          moveItemInArray(previousContainerNode.children, event.previousIndex, currentIndex);
          console.log(`内容组件移动至 ${previousContainerNode.id}.`);
        } else {
          // 从一个容器移动到另一个容器 (SLOT <-> SLOT, SLOT -> ROOT, ROOT -> SLOT)，
          const currentIndex = this.calculateCurrentIndexY(dropPoint, currentContainerNode.children);
          transferArrayItem(
            previousContainerNode.children,
            currentContainerNode.children!,
            event.previousIndex,
            currentIndex
          );
          console.log(`内容组件移动从 ${previousContainerNode.id} 至 ${previousContainerNode.id}.`);
        }
      }

      this.rootNode = { ...this.rootNode! }; // 触发变更检测
      this.updateAllCanvasDropListIds(this.rootNode); // 更新所有可拖拽区域的ID
    }
  }

  // 手动计算currentIndex
  calculateCurrentIndexY(dropPoint: { x: number, y: number }, targetChildren: ComponentNodeModel[]): number {
    if (!targetChildren || targetChildren.length === 0) {
        return 0; // 空容器，插入到第一个位置
    }

    for (let i = 0; i < targetChildren.length; i++) {
        const childNode = targetChildren[i];
        const childElement = document.getElementById(childNode.id);
        if (childElement) {
            const childRect = childElement.getBoundingClientRect();
            const childCenterY = childRect.top + childRect.height / 2;

            // 如果鼠标 Y 坐标在上半个区域，插入到当前位置
            if (dropPoint.y < childCenterY) {
                return i;
            }
        }
    }

    // 如果鼠标在最后一个组件的下方，插入到末尾
    return targetChildren.length;
}

  // 辅助方法：根据ID查找组件节点
  private findComponentNodeById(node: ComponentNodeModel | null, id: string): ComponentNodeModel | null {
    if (!node) return null;
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = this.findComponentNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  // 辅助方法：根据类型查找组件节点
  private findComponentByType(node: ComponentNodeModel | null, type: COMPONENT_TYPE): ComponentNodeModel | null {
    if (!node) return null;
    if (node.type === type) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = this.findComponentByType(child, type);
        if (found) return found;
      }
    }
    return null;
  }

  // 辅助方法：创建新的组件节点
  createComponentNode(type: COMPONENT_TYPE): ComponentNodeModel | null {
    const commonProps = {
      id: uuid.v4(),
      type: type,
      props: {},
      children: []
    };

    switch (type) {
      case COMPONENT_TYPE.ROOT:
        return { ...commonProps, props: { backgroundMode: BackgroundMode.TRANSPARENT ,backgroundColor: '#ffffff', padding: '4px', rowGap: '4px' } as RootProps };
      case COMPONENT_TYPE.SINGLE_COLUMN:
        // SingleColumn 默认包含一个 SLOT
        const singleColumnSlot: ComponentNodeModel = {
          id: uuid.v4(),
          type: COMPONENT_TYPE.SLOT,
          name: '插槽',
          props: { padding: '4px', rowGap: '4px', justifyContent: 'flex-start',alignItems: 'flex-start' } as SlotProps,
          children: []
        };
        return {
          ...commonProps,
          name: '单列',
          props: { backgroundMode: 'transparent', backgroundColor: '#ffffff', rowGap: '8px', padding: '8px', borderRadius: '12px' } as SingleColumnProps,
          children: [singleColumnSlot]
        };
      case COMPONENT_TYPE.MULTI_COLUMN:
        // MultiColumn 默认包含三个 SLOT
        const multiColumnSlots: ComponentNodeModel[] = Array.from({ length: 3 }).map(() => ({
          id: uuid.v4(),
          type: COMPONENT_TYPE.SLOT,
          name: '插槽',
          props: { padding: '4px', rowGap: '4px', alignItems: 'flex-start', justifyContent: 'flex-start' } as SlotProps,
          children: []
        }));
        return {
          ...commonProps,
          name: '多列',
          props: { slotCount: 3, backgroundMode: 'transparent', backgroundColor: '#ffffff', rowGap: '8px', padding: '8px', borderRadius: '12px' } as MultiColumnProps,
          children: multiColumnSlots
        };
      case COMPONENT_TYPE.HORIZONTAL:
        // Horizontal 默认包含三个 SLOT
        const horizontalSlots: ComponentNodeModel[] = Array.from({ length: 3 }).map(() => ({
          id: uuid.v4(),
          type: COMPONENT_TYPE.SLOT,
          name: '插槽',
          props: { padding: '4px', rowGap: '4px', alignItems: 'flex-start', justifyContent: 'flex-start' } as SlotProps,
          children: []
        }));
        return {
          ...commonProps,
          name: '横滑',
          props: { slotCount: 3, backgroundMode: 'transparent', backgroundColor: '#ffffff', rowGap: '8px', padding: '8px', borderRadius: '12px' } as HorizontalProps,
          children: horizontalSlots
        };
      case COMPONENT_TYPE.LIST:
        // List 默认包含三个SLOT竖向排列
        const listSingleColumns: ComponentNodeModel[] = Array.from({ length: 3 }).map(() => ({
          id: uuid.v4(),
          type: COMPONENT_TYPE.SLOT,
          name: '插槽',
          props: { padding: '4px', rowGap: '4px', alignItems: 'flex-start', justifyContent: 'flex-start' } as SlotProps,
          children: []
        }));
        return {
          ...commonProps,
          name: '列表',
          props: { slotCount: 3, backgroundMode: 'transparent', backgroundColor: '#ffffff', rowGap: '8px', padding: '8px', borderRadius: '12px' } as ListProps,
          children: listSingleColumns
        };
      case COMPONENT_TYPE.SLOT:
        return { ...commonProps, name: '插槽', props: { padding: '4px', rowGap: '4px', alignItems: 'flex-start', justifyContent: 'flex-start' } as SlotProps };
      case COMPONENT_TYPE.TITLE:
        return { ...commonProps, name: '标题', props: { text: '这是个标题', fontColor: '#262626', align: AlignType.CENTER } as TitleProps };
      case COMPONENT_TYPE.CONTENT:
        return { ...commonProps, name: '内容', props: { text: '这是内容', fontColor: '#262626', fontSize: ContentFontSize.REGULAR, fontWeight: 'normal', align: TextAlignType.LEFT, maxLines: 4 } as ContentProps };
      case COMPONENT_TYPE.DIVIDER:
        return { ...commonProps, name: '分割线', props: { color: '#262626', paddingTop: '8px', paddingBottom: '8px', lineType: DividerLineType.DASHED } as DividerProps };
      case COMPONENT_TYPE.IMAGE:
        return { ...commonProps, name: '图片', props: { src: 'assets/template/IMAGE.png', widthMode: ImageWidthMode.FIXED, fixedWidthSize: ImageFixedWidthSize.CUSTOM, customWidth: 60, customHeight: 60 } as ImageProps };
      case COMPONENT_TYPE.BUTTON:
        return { ...commonProps, name: '按钮', props: { buttonText: '这是按钮', buttonType: ButtonType.PRIMARY, widthMode: ButtonWidthMode.AUTO, width: 0, align: AlignType.CENTER, disabledAfterTrigger: false, actionType: ButtonActionType.CALL_PLUGIN } as ButtonProps };
      default:
        console.warn(`未知类型: ${type}`);
        return null;
    }
  }


  // 辅助方法：判断组件类型是否是一个可以接收子组件的容器
  isDroppableContainer(type: string): boolean {
    return [
      COMPONENT_TYPE.ROOT,
      COMPONENT_TYPE.SLOT,
      COMPONENT_TYPE.SINGLE_COLUMN,
      COMPONENT_TYPE.MULTI_COLUMN,
      COMPONENT_TYPE.HORIZONTAL,
      COMPONENT_TYPE.LIST
    ].includes(type as COMPONENT_TYPE);
  }

  // 辅助方法：判断是否为布局组件
  isLayoutComponent(type: string): boolean {
    return [
      COMPONENT_TYPE.SINGLE_COLUMN,
      COMPONENT_TYPE.MULTI_COLUMN,
      COMPONENT_TYPE.HORIZONTAL,
      COMPONENT_TYPE.LIST
    ].includes(type as COMPONENT_TYPE);
  }

  // 辅助方法：判断是否为内容组件 (包括布局组件和基本组件，但不包括 ROOT 和 SLOT)
  isContentComponent(type: string): boolean {
    return ![COMPONENT_TYPE.ROOT, COMPONENT_TYPE.SLOT].includes(type as COMPONENT_TYPE);
  }


  // 递归更新所有可拖拽区域的ID
  private updateAllCanvasDropListIds(node: ComponentNodeModel | null): void {
    const ids: string[] = ['canvas-root-drop-list',"container-component-list", "primitive-component-list"];
    const collectIds = (currentNode: ComponentNodeModel | null) => {
      if (currentNode) {
        if (this.isDroppableContainer(currentNode.type)) {
          ids.push(currentNode.id);
        }
        if (currentNode.children) {
          currentNode.children.forEach(child => collectIds(child));
        }
      }
    };
    collectIds(node);
    this.allCanvasDropListIds = Array.from(new Set(ids)); // 去重并更新
    console.log('Updated allCanvasDropListIds:', this.allCanvasDropListIds);
  }


  // 判断是否允许拖放新组件到目标容器
  private canDropNewComponent(draggedType: COMPONENT_TYPE, targetType: COMPONENT_TYPE): boolean {
    // 规则 1: Root 组件不可拖动，不可删除。(已经在 onDrop 开头处理了)

    // 规则 2: SLOT 组件的放置限制
    if (draggedType === COMPONENT_TYPE.SLOT) {
      // 只能作为布局组件的子级
      if (!this.isLayoutComponent(targetType)) {
        console.warn(`Rule Violation: SLOT component can only be a child of a layout component (e.g., SingleColumn, MultiColumn, Horizontal, List).`);
        return false;
      }
      // 不能被拖出布局组件直接放到 Root 组件下
      return true;
    }

    // 内容组件 (布局或基本) 的放置规则
    if (this.isContentComponent(draggedType)) {
      // 可以直接成为 Root 组件的子级
      if (targetType === COMPONENT_TYPE.ROOT) {
        return true;
      }
      // 必须放置在 SLOT 内部
      if (targetType === COMPONENT_TYPE.SLOT && draggedType !== COMPONENT_TYPE.TITLE) {
        return true;
      }
      // 不能直接成为布局组件（SINGLE_COLUMN, MULTI_COLUMN, HORIZONTAL, LIST）的直接子级
      if (this.isLayoutComponent(targetType)) {
        console.warn(`Rule Violation: Content components cannot be a direct child of layout components (${targetType}). They must be placed inside a SLOT.`);
        return false;
      }
    }
    return false;
  }

  // 判断是否允许拖放画布中已存在的组件到目标容器
  private canDropExistingComponent(draggedNode: ComponentNodeModel, targetNode: ComponentNodeModel): boolean {
    const draggedType = draggedNode.type;
    const targetType = targetNode.type;

    // Root 组件不可拖动
    if (draggedType === COMPONENT_TYPE.ROOT) {
      console.warn('Root组件不可移动');
      return false;
    }
    // Title 组件不可拖动
    if (draggedType === COMPONENT_TYPE.TITLE) {
      console.warn('标题组件不可移动');
      return false;
    }
    if (draggedType === COMPONENT_TYPE.SLOT) {
      // 在这里确保SLOT父级目标是一个布局组件
      if (!this.isLayoutComponent(targetType)) {
        return false;
      }
      // SLOT 不能作为 Root 的直接子级
      if (targetType === COMPONENT_TYPE.ROOT) {
        return false;
      }
      return true;
    }

    // 其他组件
    if (this.isContentComponent(draggedType)) {
      // 可以在 SLOT 内部移动（排序）,也可以从一个 SLOT 移动到另一个 SLOT
      if (targetType === COMPONENT_TYPE.SLOT) {
        return true;
      }
      // 也可以从一个Slot拖动到Root组件下面
      if (targetType === COMPONENT_TYPE.ROOT) {
        return true;
      }
      // 不能直接成为布局组件（SINGLE_COLUMN, MULTI_COLUMN, HORIZONTAL, LIST）的直接子级
      if (this.isLayoutComponent(targetType)) {
        console.warn(`(${targetType})不能直接成为布局组件（SINGLE_COLUMN, MULTI_COLUMN, HORIZONTAL, LIST）的直接子级`);
        return false;
      }
      return true;
    }

    return false; // 默认不允许
  }

  /**
   * @param rootNode 树的根节点
   * @param nodeIdToUpdate 要更新的节点ID
   * @param newProps 新的props对象
   * @returns 更新后的新树
   */
  updateNodeProps(newProps: any, nodeIdToUpdate: string): ComponentNodeModel {

    // 深度克隆原始树的根节点，以避免直接修改原始数据
    const updatedRootNode = this.deepCloneNode(this.rootNode);

    let nodeFound = false;

    // 内部递归函数，用于遍历并更新节点
    const traverseAndUpdate = (currentNode: ComponentNodeModel) => {
      // 检查当前节点是否是目标节点
      if (currentNode.id === nodeIdToUpdate) {
        // 直接更新props
        currentNode.props = newProps;
        nodeFound = true;
        return;
      }

      // 如果当前节点有子节点，则递归遍历子节点
      if (currentNode.children && currentNode.children.length > 0) {
        for (let i = 0; i < currentNode.children.length; i++) {
          const childNode = currentNode.children[i];
          traverseAndUpdate(childNode);
          if (nodeFound) { // 如果在子节点中找到了，也可以提前返回
            return;
          }
        }
      }
    };

    traverseAndUpdate(updatedRootNode);

    // 返回更新后的根节点
    return updatedRootNode;
  }

  /**
   * 根据模式修改指定节点的子节点
   * @param targetNodeId 要修改子节点的节点ID
   * @param mode 子节点修改模式 (Add 或 RemoveAt)
   * @param value 根据模式有不同含义：
   * - 如果 mode 为 Add: value 是目标子节点总数量 (当原本数量不足时，会增补到此数量)
   * - 如果 mode 为 Remove: value 是要删除的子节点的下标
   * @returns 更新后的新树根节点
   */
  modifyNodeChildren(
    value: number,
    targetNodeId: string,
    mode: 'add' | 'remove'
  ): ComponentNodeModel {
    // 深度克隆原始树的根节点，以避免直接修改原始数据
    const updatedRootNode = this.deepCloneNode(this.rootNode);

    let nodeFound = false;

    // 内部递归函数，用于遍历并更新节点
    const traverseAndModify = (currentNode: ComponentNodeModel) => {
      // 检查当前节点是否是目标节点
      if (currentNode.id === targetNodeId) {
        nodeFound = true;

        switch (mode) {
          case 'add':
            const currentChildrenCount = currentNode.children.length;
            const targetTotalCount = value; // 此时 value 是目标总数量

            if (currentChildrenCount < targetTotalCount) {
              const nodesToAdd = targetTotalCount - currentChildrenCount;
              for (let i = 0; i < nodesToAdd; i++) {
                currentNode.children.push(this.createComponentNode(COMPONENT_TYPE.SLOT));
              }
            } else if (currentChildrenCount > targetTotalCount) {
              // 如果目标总数小于当前数量，则截断
              currentNode.children = currentNode.children.slice(0, targetTotalCount);
            }
            break;

          case 'remove':
            const indexToRemove = value; // 此时 value 是要删除的下标

            if (indexToRemove >= 0 && indexToRemove < currentNode.children.length) {
              // 使用 splice 删除指定下标的元素
              currentNode.children.splice(indexToRemove, 1);
            } else {
              console.warn(`尝试删除${targetNodeId}.子节点`);
            }
            break;

          default:
            console.warn(`删除失败: ${mode}`);
            break;
        }
        return; // 找到并更新后即可停止当前分支的遍历
      }

      // 如果当前节点有子节点，则递归遍历子节点
      if (currentNode.children && currentNode.children.length > 0) {
        for (let i = 0; i < currentNode.children.length; i++) {
          const childNode = currentNode.children[i];
          traverseAndModify(childNode);
          if (nodeFound) { // 如果在子节点中找到了，也可以提前返回
            return;
          }
        }
      }
    };

    traverseAndModify(updatedRootNode);
    return updatedRootNode;
  }


  // 辅助函数：深度克隆单个节点及其子节点
  private deepCloneNode(node: ComponentNodeModel): ComponentNodeModel {
    return {
      ...node,
      props: { ...node.props }, // 确保props也是深拷贝
      children: node.children ? node.children.map(child => this.deepCloneNode(child)) : []
    };
  }

  upadteProps(newProps: any, nodeIdToUpdate: string) :void {
    this.rootNode = this.updateNodeProps(newProps, nodeIdToUpdate);
    this.updateAllCanvasDropListIds(this.rootNode);
  }

  updateLayoutSlot(props: { value: number, mode: 'add' | 'remove' }, nodeIdToUpdate: string) :void { 
    this.rootNode = this.modifyNodeChildren(props.value, nodeIdToUpdate, props.mode);
    this.updateAllCanvasDropListIds(this.rootNode);
  } 
}