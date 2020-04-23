import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPagePageRoutingModule } from './list-page-routing.module';

import { ListPagePage } from './list-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPagePageRoutingModule
  ],
  declarations: [ListPagePage]
})
export class ListPagePageModule {}
