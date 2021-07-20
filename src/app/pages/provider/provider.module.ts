import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderPageRoutingModule } from './provider-routing.module';

import { ProviderPage } from './provider.page';
import { MaterialModule } from 'src/app/components/material.module';
import { SharedModule } from 'src/app/components/shared.module';
import { NgOtpInputModule } from  'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MaterialModule,
    ProviderPageRoutingModule,
    SharedModule,
    NgOtpInputModule
  ],
  declarations: [ProviderPage]
})
export class ProviderPageModule {}
