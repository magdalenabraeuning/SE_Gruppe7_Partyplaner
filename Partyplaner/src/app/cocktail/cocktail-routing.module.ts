import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CocktailPage } from './cocktail.page';

const routes: Routes = [
  {
    path: '',
    component: CocktailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CocktailPageRoutingModule {}
