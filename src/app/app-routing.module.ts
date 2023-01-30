import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
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
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
