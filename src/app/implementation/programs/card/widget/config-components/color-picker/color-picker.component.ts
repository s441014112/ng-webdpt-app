import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef  } from '@angular/core';

interface Color {
  text: string;
  value: string;
  label?: string;
  label1?: string;
}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.less']

})
export class ColorPickerComponent implements OnInit {

  @Input() currentColor: string = '';

  @Output() colorChange = new EventEmitter<string>();

  selectedColor: string | null = '#262626';

  colorName: string = '焦炭黑'

  isDropdownOpen: boolean = false;

  colors: Color[][] = [
    [
      { value: '#ffffff', text: '云朵白', label: '云朵白', label1: '纯净基础白' },
      { value: '#808080', text: '风暴灰', label: '风暴灰', label1: '标准中灰' },
      { value: '#44546a', text: '岩层灰', label: '岩层灰', label1: '蓝灰中性色' },
      { value: '#5b9bd5', text: '晴空蓝', label: '晴空蓝', label1: '明亮主蓝' },
      { value: '#ed7d31', text: '落日橙', label: '落日橙', label1: '活力主橙' },
      { value: '#ffc000', text: '琥珀黄', label: '琥珀黄', label1: '鲜明主黄' },
      { value: '#4472c4', text: '宝石蓝', label: '宝石蓝', label1: '饱和中蓝' },
      { value: '#70ad47', text: '苔原绿', label: '苔原绿', label1: '清新主绿' },
    ],
    [
      { value: '#f2f2f2', text: '薄雾灰', label: '薄雾灰', label1: '浅灰偏白' },
      { value: '#7f7f7f', text: '铅灰', label: '铅灰', label1: '沉稳灰调' },
      { value: '#d6dce5', text: '冰川灰', label: '冰川灰', label1: '蓝调浅灰' },
      { value: '#deebf7', text: '冰晶蓝', label: '冰晶蓝', label1: '冷调极浅蓝' },
      { value: '#f8cbad', text: '杏奶油', label: '杏奶油', label1: '浅暖橙调' },
      { value: '#ffe699', text: '奶油黄', label: '奶油黄', label1: '柔和浅黄' },
      { value: '#dae3f3', text: '天幕蓝', label: '天幕蓝', label1: '淡雅灰蓝' },
      { value: '#a9d18e', text: '薄荷绿', label: '薄荷绿', label1: '浅灰绿调' },
    ],
    [
      { value: '#d9d9d9', text: '银鼠灰', label: '银鼠灰', label1: '柔和中性灰' },
      { value: '#595959', text: '玄武灰', label: '玄武灰', label1: '深灰偏黑' },
      { value: '#ADB9CA', text: '蓝调中灰', label: '蓝调中灰', label1: '蓝调中灰' },
      { value: '#bdd7ee', text: '雾霭蓝', label: '雾霭蓝', label1: '朦胧灰蓝' },
      { value: '#fbe5d6', text: '沙丘色', label: '沙丘色', label1: '极浅米橙' },
      { value: '#fff2cc', text: '香草白', label: '香草白', label1: '近白浅黄' },
      { value: '#B4C7E7', text: '淡雅中蓝', label: '淡雅中蓝', label1: '淡雅中蓝' },
      { value: '#c5e0b4', text: '嫩芽绿', label: '嫩芽绿', label1: '淡雅黄绿' },
    ],
    [
      { value: '#bfbfbf', text: '水泥灰', label: '水泥灰', label1: '中低调灰' },
      { value: '#404040', text: '暗影灰', label: '暗影灰', label1: '近黑深灰' },
      { value: '#8497b0', text: '钢青灰', label: '钢青灰', label1: '灰蓝中性色' },
      { value: '#9dc3e6', text: '浅湾蓝', label: '浅湾蓝', label1: '柔和淡蓝' },
      { value: '#f4b183', text: '陶土橙', label: '陶土橙', label1: '温暖橙棕' },
      { value: '#ffd966', text: '蜂蜜黄', label: '蜂蜜黄', label1: '明亮中黄' },
      { value: '#8faadc', text: '湖光蓝', label: '湖光蓝', label1: '清透中蓝' },
      { value: '#e2f0d9', text: '雾绿', label: '雾绿', label1: '极浅灰绿' },
    ],
    [
      { value: '#a6a6a6', text: '石板灰', label: '石板灰', label1: '冷感中灰' },
      { value: '#262626', text: '焦炭黑', label: '焦炭黑', label1: '极深近黑' },
      { value: '#333f50', text: '暗礁蓝', label: '暗礁蓝', label1: '深蓝灰' },
      { value: '#2e75b6', text: '深海蓝', label: '深海蓝', label1: '浓郁经典蓝' },
      { value: '#c55a11', text: '赤陶橙', label: '赤陶橙', label1: '浓郁深橙' },
      { value: '#bf9000', text: '芥末黄', label: '芥末黄', label1: '深调土黄' },
      { value: '#2F5597', text: '清透深蓝', label: '清透深蓝', label1: '清透深蓝' },
      { value: '#548235', text: '森林绿', label: '森林绿', label1: '沉稳深绿' },
    ],
    [
      { value: '#000000', text: '午夜黑', label: '午夜黑', label1: '经典深黑' },
      { value: '#0d0d0d', text: '深渊黑', label: '深渊黑', label1: '最暗黑调' },
      { value: '#222a35', text: '夜空蓝', label: '夜空蓝', label1: '近黑蓝灰' },
      { value: '#1f4e79', text: '午夜蓝', label: '午夜蓝', label1: '深邃暗蓝' },
      { value: '#843c0b', text: '焦糖棕', label: '焦糖棕', label1: '暗调橙棕' },
      { value: '#7f6000', text: '古铜金', label: '古铜金', label1: '暗沉黄棕' },
      { value: '#203864', text: '军舰蓝', label: '军舰蓝', label1: '冷调深蓝' },
      { value: '#385723', text: '松针绿', label: '松针绿', label1: '暗调墨绿' },
    ]
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  // 优化后的颜色查找方法
  private findColorName(colorValue: string): string {
    for (const row of this.colors) {
      const found = row.find(c => c.value === colorValue);
      if (found) return found.text;
    }
    return '请选择颜色';
  }

  ngOnInit(): void {
    this.selectedColor = this.currentColor;
  }

  onColorSelect(color: string): void {
    this.selectedColor = color;
    this.colorName = this.findColorName(color);
    this.isDropdownOpen = false;
    this.colorChange.emit(color);
    this.cdr.detectChanges(); // 手动触发变更检测
  }
}