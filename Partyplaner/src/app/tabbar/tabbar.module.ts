import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabbarPageRoutingModule } from './tabbar-routing.module';

import { TabbarPage } from './tabbar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabbarPageRoutingModule
  ],
  declarations: [TabbarPage]
})
export class TabbarPageModule {}
