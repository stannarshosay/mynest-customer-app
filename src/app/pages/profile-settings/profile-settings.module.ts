import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileSettingsPageRoutingModule } from './profile-settings-routing.module';

import { ProfileSettingsPage } from './profile-settings.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    IonicModule,
    ProfileSettingsPageRoutingModule
  ],
  declarations: [ProfileSettingsPage]
})
export class ProfileSettingsPageModule {}
