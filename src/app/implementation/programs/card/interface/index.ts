/**
 * 表示画布上的组件节点模型
 * 可以包含自身作为子节点（递归结构）
 * id 唯一标识符，uuid
 * type 组件类型
 * name 组件显示名称
 * props 组件属性配置
 * children 子组件列表
 */
export interface ComponentNodeModel {
  id: string;
  type: string;
  name?: string;
  props?: Record<string, any>;
  children?: ComponentNodeModel[];
}

/**
 * Root 组件属性
 * backgroundMode 背景模式 (颜色/透明)
 * backgroundColor  背景颜色
 * rowGap 行间距
 * padding 内边距
*/ 
export interface RootProps {
  backgroundMode?: string;
  backgroundColor?: string;
  rowGap?: string;
  padding?: string;
}

/**
 * Slot 插槽组件属性
 * alignItems 垂直对齐
 * justifyContent 水平对齐
 * rowGap 行间距
 * padding 内边距
 */
export interface SlotProps {
  alignItems?: string;
  justifyContent?: string;
  rowGap?: string;
  padding?: string;
}

/**
 * 布局组件通用属性 (SingleColumn, MultiColumn, Horizontal, List)
 * slotCount 插槽数量
 * backgroundMode 背景模式 (颜色/透明)
 * backgroundColor 背景颜色
 * rowGap 行间距
 * padding 内边距
 * borderRadius 圆角
 */
export interface LayoutComponentProps {
  slotCount?: number;
  backgroundMode?: string;
  backgroundColor?: string;
  rowGap?: string;
  padding?: string;
  borderRadius?: string;
}

// 单列组件属性 (继承 LayoutComponentProps)
export interface SingleColumnProps extends LayoutComponentProps {}

// 多列组件属性 (继承 LayoutComponentProps)
export interface MultiColumnProps extends LayoutComponentProps {}

// 横滑组件属性 (继承 LayoutComponentProps)
export interface HorizontalProps extends LayoutComponentProps {}

// 列表布局组件属性 (内部初始化三个单列组件，可增删，最多8个单列组件)
export interface ListProps extends LayoutComponentProps {}

// 标题组件属性
export interface TitleProps {
  text: string;
  fontColor?: string;
  align?: string;
}

/**
 * 内容组件属性
 * text 内容
 * fontColor 颜色
 * fontWeight 字体 (常规或加粗)
 * fontSize 字体大小
 * align 对齐
 * maxLines 最大行数 (最多5行)
 * loopRender 循环渲染 (高级设置)
 */
export interface ContentProps {
  text: string;
  fontColor?: string;
  fontWeight?: 'normal' | 'bold';
  fontSize?: string;
  align?: string;
  maxLines?: number;
  loopRender?: boolean;
}

/**
 * 分割线组件属性
 * color 线条颜色
 * paddingTop 上边距
 * paddingBottom 下边距
 * lineType 线型
 */
export interface DividerProps {
  color?: string;
  paddingTop?: string;
  paddingBottom?: string;
  lineType?: string;
}

/**
 * 图片组件属性
 * widthMode 宽度模式 (宽度铺满/固定宽度)
 * customWidth 自定义宽度 (当 widthMode 为 FIXED 且未选择 fixedWidthSize 时)
 * customHeight 自定义高度 (当 widthMode 为 FIXED 且未选择 fixedWidthSize 时)
 */
export interface ImageProps {
  src: string;
  widthMode?: 'full' | 'fixed';
  fixedWidthSize?: string; 
  customWidth?: number;
  customHeight?: number; 
  loopRender?: boolean;
}

/**
 * 按钮组件属性
 * buttonType 按钮类型 (普通/主按钮/危险按钮)
 * buttonText 按钮文本
 * widthMode 宽度模式 (自动/拉伸/固定)
 * width 宽度
 * align 对齐方式
 * disabledAfterTrigger 触发后是否禁用
 * actionType 按钮操作
 */
export interface ButtonProps {
  buttonType?: string;
  buttonText?: string;
  widthMode?: 'auto' | 'stretch' | 'fixed';
  width?: number;
  align?: string;
  disabledAfterTrigger?: boolean;
  actionType?: 'CALL_PLUGIN' | 'OPEN_URL';
}

