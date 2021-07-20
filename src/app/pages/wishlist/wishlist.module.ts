import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishlistPageRoutingModule } from './wishlist-routing.module';
import { NgOtpInputModule } from  'ng-otp-input';
import { WishlistPage } from './wishlist.page';
import { SharedModule } from 'src/app/components/shared.module';
import { MaterialModule } from 'src/app/components/material.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgxPaginationModule,
    IonicModule,
    SharedModule,
    WishlistPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [WishlistPage]
})
export class WishlistPageModule {}
