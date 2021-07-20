import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsfeedPageRoutingModule } from './newsfeed-routing.module';

import { NewsfeedPage } from './newsfeed.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    NewsfeedPageRoutingModule
  ],
  declarations: [NewsfeedPage]
})
export class NewsfeedPageModule {}
