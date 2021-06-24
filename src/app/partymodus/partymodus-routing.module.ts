import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartymodusPage } from './partymodus.page';

const routes: Routes = [
  {
    path: '',
    component: PartymodusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartymodusPageRoutingModule {}
