/**
 * 表示画布上的组件节点模型
 * 可以包含自身作为子节点（递归结构）
 */
export interface ComponentNodeModel {
  id: string;             // 唯一标识符，uuid
  type: string;           // 组件类型
  name?: string;          // 组件显示名称（可选）
  props?: Record<string, any>; // 组件属性配置（可选）
  children?: ComponentNodeModel[]; // 子组件列表（递归结构）
}

// Root 组件属性
export interface RootProps {
  backgroundColor?: string;
  rowGap?: string; // 行内距
  padding?: string;  // 内边距
}

// Slot 插槽组件属性
export interface SlotProps {
  alignItems?: string; // 垂直对齐 
  justifyContent?: string; // 水平对齐 
  rowGap?: string; // 行间距 
  padding?: string; // 内边距 (0, 2, 4, 8) 
}

// 布局组件通用属性 (SingleColumn, MultiColumn, Horizontal, List)
export interface LayoutComponentProps {
  slotCount?: number; // 插槽数量 (虽然单列组件默认只有一个插槽，但多列/横滑组件会用到)
  backgroundMode?: string; // 背景模式 (颜色/透明)
  backgroundColor?: string; // 背景颜色
  rowGap?: string; // 行间距 (布局容器内部的行间距)
  padding?: string; // 内边距
  borderRadius?: string; // 圆角
}

// 单列组件属性 (继承 LayoutComponentProps)
export interface SingleColumnProps extends LayoutComponentProps {}

// 多列组件属性 (继承 LayoutComponentProps)
export interface MultiColumnProps extends LayoutComponentProps {}

// 横滑组件属性 (继承 LayoutComponentProps)
export interface HorizontalProps extends LayoutComponentProps {}

// 列表布局组件属性 (内部初始化三个单列组件，可增删，最多8个单列组件)
export interface ListProps extends LayoutComponentProps {
  columnCount?: number;  // 单列组件数量 (默认3个，可增删，最多8个)
}

// 标题组件属性
export interface TitleProps {
  text: string;
  fontColor?: string;
  align?: string;
}

// 内容组件属性
export interface ContentProps {
  text: string;
  fontColor?: string; // 颜色 
  fontWeight?: 'normal' | 'bold'; // 字体 (常规或加粗) 
  fontSize?: string; // 字体大小 
  align?: string; // 对齐 
  maxLines?: number; // 最大行数 (最多5行) 
  loopRender?: boolean; // 循环渲染 (高级设置) 
}

// 分割线组件属性
export interface DividerProps {
  color?: string; // 线条颜色 
  paddingTop?: string; // 上边距 
  paddingBottom?: string; // 下边距 
  lineType?: string; // 线型
}

/**
 * 图片组件属性
 * customWidth 自定义宽度 (当 widthMode 为 FIXED 且未选择 fixedWidthSize 时)
 * customHeight 自定义高度 (当 widthMode 为 FIXED 且未选择 fixedWidthSize 时)
 */
export interface ImageProps {
  src: string;
  widthMode?: 'full' | 'fixed'; // 宽度模式：固定宽度 / 宽度铺满
  fixedWidthSize?: string; 
  customWidth?: number;
  customHeight?: number; 
  loopRender?: boolean;
}

// 按钮组件属性
export interface ButtonProps {
  buttonType?: string; // 按钮类型 
  buttonText?: string;
  widthMode?: 'auto' | 'stretch' | 'fixed'; // 宽度模式 
  width?: number; // 固定宽度时的值 
  align?: string; // 对齐方式 
  disabledAfterTrigger?: boolean; // 触发后是否禁用 
  actionType?: 'CALL_PLUGIN' | 'OPEN_URL'; // 按钮操作 
}

