import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewQoutesPageRoutingModule } from './view-qoutes-routing.module';

import { ViewQoutesPage } from './view-qoutes.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ViewQoutesPageRoutingModule
  ],
  declarations: [ViewQoutesPage]
})
export class ViewQoutesPageModule {}
