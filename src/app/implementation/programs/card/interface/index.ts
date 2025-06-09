/**
 * 画布slot组件，可以包含自身
 */
export interface ComponentNode {
  id: string,
  type: string,
  name: string,
  children: ComponentNode[],
}