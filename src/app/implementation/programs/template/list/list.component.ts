import { Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { Router } from '@angular/router';

import { ITemplate } from '../interface';

import { TemplateService } from '../service/template.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

  // 模板列表
  templateDataSource: ITemplate[] = [];
  // 模板新增弹窗显示标识
  isModalVisible = false;
  // 模板新增表单数据, 类型省略
  formData:ITemplate = {
    id: this.gerateId(),
    name: '',
    description: ''
  };

  constructor(private templateService: TemplateService, private router: Router) { }

  ngOnInit(): void {
    this.getTemplateDataSource()
  }

  getTemplateDataSource() {
    this.templateService.getTemplates()
    .subscribe(templates => this.templateDataSource = templates);
  }

  // 点击新增模板
  addTemplate(): void {
    this.formData = {
      id: '',
      name: '',
      description: ''
    };
    this.isModalVisible = true;
  }

  editTemplate(templateId: string, templateName: string): void {
    //  跳转并传递参数
    this.router.navigate(['/card/widget'], {
      queryParams: { id: templateId, name: templateName }
    });
  }

  // 点击弹窗按钮确定按钮，确认新增模板
  handleSubmit(): void  {
    if (!this.formData.name.trim()) {
      alert('模板名称不能为空');
      return;
    }

    //  跳转并传递参数
    this.router.navigate(['/card/widget'], {
      queryParams: { ...this.formData, ...{ id: this.gerateId() } }
    });

    this.isModalVisible = false;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  gerateId(): string {
    return uuid.v4();
  }

}
