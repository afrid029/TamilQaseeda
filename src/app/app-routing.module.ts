import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'ajmeer',
    loadChildren: () => import('./ajmeer/ajmeer.module').then( m => m.AjmeerPageModule)
  },
  {
    path: 'muhyidden',
    loadChildren: () => import('./muhyidden/muhyidden.module').then( m => m.MuhyiddenPageModule)
  },
  {
    path: 'prophet',
    loadChildren: () => import('./prophet/prophet.module').then( m => m.ProphetPageModule)
  },
  {
    path: 'shahul',
    loadChildren: () => import('./shahul/shahul.module').then( m => m.ShahulPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'ziyarams',
    loadChildren: () => import('./ziyarams/ziyarams.module').then( m => m.ZiyaramsPageModule)
  },
  {
    path: 'evidence',
    loadChildren: () => import('./evidence/evidence.module').then( m => m.EvidencePageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'add-ziyaram',
    loadChildren: () => import('./add-ziyaram/add-ziyaram.module').then( m => m.AddZiyaramPageModule)
  },
  {
    path: 'add-evidence',
    loadChildren: () => import('./add-evidence/add-evidence.module').then( m => m.AddEvidencePageModule)
  },
  {
    path: 'add-calendar',
    loadChildren: () => import('./add-calendar/add-calendar.module').then( m => m.AddCalendarPageModule)
  },
  {
    path: 'google-map',
    loadChildren: () => import('./google-map/google-map.module').then( m => m.GoogleMapPageModule)
  },
  {
    path: 'dua',
    loadChildren: () => import('./dua/dua.module').then( m => m.DuaPageModule)
  },
  {
    path: 'add-dua',
    loadChildren: () => import('./add-dua/add-dua.module').then( m => m.AddDuaPageModule)
  },
  {
    path: 'wallalert',
    loadChildren: () => import('./wallalert/wallalert.module').then( m => m.WallalertPageModule)
  },
  {
    path: 'others',
    loadChildren: () => import('./others/others.module').then( m => m.OthersPageModule)
  },
  {
    path: 'moulids',
    loadChildren: () => import('./moulids/moulids.module').then( m => m.MoulidsPageModule)
  },
  {
    path: 'moulidview',
    loadChildren: () => import('./moulidview/moulidview.module').then( m => m.MoulidviewPageModule)
  },  {
    path: 'qand-a',
    loadChildren: () => import('./qand-a/qand-a.module').then( m => m.QandAPageModule)
  },
  {
    path: 'floating-text',
    loadChildren: () => import('./floating-text/floating-text.module').then( m => m.FloatingTextPageModule)
  },

 
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
