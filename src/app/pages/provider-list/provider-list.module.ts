import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderListPageRoutingModule } from './provider-list-routing.module';
import { NgOtpInputModule } from  'ng-otp-input';

import { ProviderListPage } from './provider-list.page';
import { MaterialModule } from 'src/app/components/material.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MaterialModule,
    NgxPaginationModule,
    ProviderListPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [ProviderListPage]
})
export class ProviderListPageModule {}
