import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabbarPage } from './tabbar.page';




const routes: Routes = [
  {
    path: '',
    component: TabbarPage,
    children: [
{
  path: 'cocktail',
  loadChildren: () => import('../cocktail/cocktail.module').then( m => m.CocktailPageModule)
},
{
  path: 'info',
  loadChildren: () => import('../info/info.module').then( m => m.InfoPageModule)
},
{
  path: 'listen',
  loadChildren: () => import('../listen/listen.module').then( m => m.ListenPageModule)
},
{
  path: 'partymodus',
  loadChildren: () => import('../partymodus/partymodus.module').then( m => m.PartymodusPageModule)
},    ]
},{
  path: '',
  redirectTo: 'partys',
  pathMatch:'full'
}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabbarPageRoutingModule {}