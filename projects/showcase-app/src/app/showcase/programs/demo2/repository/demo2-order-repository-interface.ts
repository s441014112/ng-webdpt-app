export interface IGetOrderDetailParam {
  orderId: string;
}

/**
 * 查詢條件欄位
 *
 * @export
 */
export class IDemo2OrderSearchField {
  orderId: string;
  private _status: Array<string>;
  total: string;
  customerName: string;
  salesmanName: string;
  private _gender: Array<string>;

  get status(): Array<string> {
    return this._status;
  }

  set status(value: Array<string>) {
    if (!value || value.length === 0) {
      this._status = [];
      return;
    }
    this._status = value;
  }

  get gender(): Array<string> {
    return this._gender;
  }

  set gender(value: Array<string>) {
    if (!value || value.length === 0) {
      this._gender = [];
      return;
    }
    this._gender = value;
  }
}

export interface IDemo2OrderSortSet {
  sortName: string; // 排序欄位
  sortExpression: string; // 排序順序
}

/**
 * 查詢列表傳入參數
 *
 * @export
 */
export interface IGetOrderListParam {
  pageSize: number;
  currentPage: number;
  param: IDemo2OrderSearchField;
  sortSet: IDemo2OrderSortSet[];
}
