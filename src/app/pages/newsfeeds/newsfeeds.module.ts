import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsfeedsPageRoutingModule } from './newsfeeds-routing.module';

import { NewsfeedsPage } from './newsfeeds.page';
import { MaterialModule } from 'src/app/components/material.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    NgxPaginationModule,
    NewsfeedsPageRoutingModule
  ],
  declarations: [NewsfeedsPage]
})
export class NewsfeedsPageModule {}
