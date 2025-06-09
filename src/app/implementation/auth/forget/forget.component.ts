import { Component, Inject, OnInit } from '@angular/core';
import { IDwForgetverificationType } from '@webdpt/framework/account';
import { DwSystemConfigService, Logo_Path } from '@webdpt/framework/config';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
  public logoCompany = './assets/img/i18n/zh_CN/logo/dwLogo-company.svg';
  verificationType: Array<IDwForgetverificationType> = [];

  constructor(
    @Inject(Logo_Path) public dwLogoPath: string,
    public configService: DwSystemConfigService,
  ) { }

  ngOnInit(): void {
    this.configService.get('dwLogoApp').subscribe(
      (logoPath: string) => {
        if (logoPath) {
          this.logoCompany = logoPath;
        }
      }
    );
    this.verificationType = [
      IDwForgetverificationType.EMAIL,
      IDwForgetverificationType.MOBILEPHONE
    ];
  }
}
