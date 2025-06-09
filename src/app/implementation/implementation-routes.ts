import { Routes } from '@angular/router';

export const IMPLEMENTATION_ROUTES: Routes = [
  // 設定應用開發應用模組路由
  {
    path: '', // 首頁
    pathMatch: 'prefix',
    loadChildren: (): Promise<any> => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'template', // 新的路由
    pathMatch: 'prefix',
    loadChildren: (): any => import('./programs/template/template.module').then(m => m.TemplateModule)
  },
  {
    path: 'card', // 新的路由
    pathMatch: 'prefix',
    loadChildren: (): any => import('./programs/card/card.module').then(m => m.CardModule)
  }
];
