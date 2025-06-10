// 组件类型枚举值
export enum COMPONENT_TYPE {
  SINGLE_COLUMN = 'SINGLE_COLUMN', // 单列
  MULTI_COLUMN = 'MULTI_COLUMN', // 多列
  HORIZONTAL = 'HORIZONTAL', // 横向滑动
  LIST = 'LIST', // 列表
  TITLE = 'TITLE', // 标题
  CONTENT = 'CONTENT', // 内容
  DIVIDER = 'DIVIDER', // 分割线
  IMAGE = 'IMAGE', // 图片
  BUTTON = 'BUTTON', // 按钮
  ROOT = 'ROOT', // 根容器节点
  SLOT = 'SLOT', // 插槽   新增专用 其他人忽略
}

// 内容组件字体大小
export enum ContentFontSize {
  SMALL = 'small', // 小号
  REGULAR = 'default', // 常规
  LARGE = 'large', // 大号
}

// 分割线线型
export enum DividerLineType {
  SOLID = 'solid', // 实线 (直线)
  DASHED = 'dashed', // 虚线
  DOTTED = 'dotted',
}

// 图片组件宽度模式
export enum ImageWidthMode {
  FIXED = 'fixed', // 固定宽度
  FULL = 'full', // 宽度铺满
}

// 图片固定宽度尺寸
export enum ImageFixedWidthSize {
  SMALL = 'small',  // 小尺寸
  NORMAL = 'normal', // 中尺寸 (常规)
  LARGE = 'large'   // 大尺寸
}

// 按钮类型
export enum ButtonType {
  PRIMARY = 'primary', // 主要按钮
  SECONDARY = 'default', // 次要按钮
  TERTIARY = 'dashed', // 三级按钮
  QUATERNARY = 'link', // 四级按钮
  TEXT = 'text', // 文字按钮
  DANGER = 'danger', // 警告按钮
}

// 按钮宽度模式
export enum ButtonWidthMode {
  AUTO = 'auto', // 自适应
  STRETCH = 'stretch', // 拉伸
  FIXED = 'fixed', // 固定宽度
}

// 按钮操作类型
export enum ButtonActionType {
  CALL_PLUGIN = 'CALL_PLUGIN', // 调用插件
  OPEN_URL = 'OPEN_URL', // 打开URL
}

// 对齐方式 (垂直/水平)
export enum AlignType {
  TOP = 'flex-start',
  MIDDLE = 'center',
  BOTTOM = 'flex-end',
  LEFT = 'flex-start',
  CENTER = 'center',
  RIGHT = 'flex-end',
}
