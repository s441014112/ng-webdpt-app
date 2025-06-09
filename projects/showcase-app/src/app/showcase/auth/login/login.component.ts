import { Component, Inject, OnInit } from '@angular/core';
import { DwLoginTypeEnum } from '@webdpt/framework/account';
import { DW_SYSTEM_CONFIG, DwSystemConfigService, Logo_Path } from '@webdpt/framework/config';

@Component({
  selector: 'app-showcase-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class ShowcaseLoginComponent implements OnInit {
  public logoCompany = './assets/img/i18n/zh_CN/logo/dwLogo-company.svg';
  public tabSelectedIndex = DwLoginTypeEnum.GENERAL;
  dwVersion = DW_SYSTEM_CONFIG.dwVersion ? DW_SYSTEM_CONFIG.dwVersion.replace(/\.[^.]*$/, '') : '';

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
  }

}
