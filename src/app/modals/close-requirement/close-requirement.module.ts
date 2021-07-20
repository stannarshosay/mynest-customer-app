import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CloseRequirementPageRoutingModule } from './close-requirement-routing.module';

import { CloseRequirementPage } from './close-requirement.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    IonicModule,
    CloseRequirementPageRoutingModule
  ],
  declarations: [CloseRequirementPage]
})
export class CloseRequirementPageModule {}
