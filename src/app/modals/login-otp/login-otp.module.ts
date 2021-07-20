import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginOtpPageRoutingModule } from './login-otp-routing.module';
import { NgOtpInputModule } from  'ng-otp-input';
import { LoginOtpPage } from './login-otp.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    IonicModule,
    LoginOtpPageRoutingModule,    
    NgOtpInputModule
  ],
  declarations: [LoginOtpPage]
})
export class LoginOtpPageModule {}
