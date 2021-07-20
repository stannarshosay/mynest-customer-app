import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProvidersListSubPageRoutingModule } from './providers-list-sub-routing.module';

import { ProvidersListSubPage } from './providers-list-sub.page';
import { NgOtpInputModule } from 'ng-otp-input';
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
    ProvidersListSubPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [ProvidersListSubPage]
})
export class ProvidersListSubPageModule {}
