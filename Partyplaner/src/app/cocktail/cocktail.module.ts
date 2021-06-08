import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CocktailPageRoutingModule } from './cocktail-routing.module';

import { CocktailPage } from './cocktail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CocktailPageRoutingModule
  ],
  declarations: [CocktailPage]
})
export class CocktailPageModule {}
