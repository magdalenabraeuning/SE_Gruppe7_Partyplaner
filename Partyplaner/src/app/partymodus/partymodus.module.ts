import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartymodusPageRoutingModule } from './partymodus-routing.module';

import { PartymodusPage } from './partymodus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartymodusPageRoutingModule
  ],
  declarations: [PartymodusPage]
})
export class PartymodusPageModule {}
