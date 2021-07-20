import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MaterialModule } from '../components/material.module';
import { NgOtpInputModule } from  'ng-otp-input';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaterialModule,
    HomePageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
