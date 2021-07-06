import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartysPageRoutingModule } from './partys-routing.module';

import { PartysPage } from './partys.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartysPageRoutingModule
  ],
  declarations: [PartysPage]
})
export class PartysPageModule {}
