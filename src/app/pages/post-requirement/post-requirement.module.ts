import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostRequirementPageRoutingModule } from './post-requirement-routing.module';

import { PostRequirementPage } from './post-requirement.page';
import { SharedModule } from 'src/app/components/shared.module';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    PostRequirementPageRoutingModule
  ],
  declarations: [PostRequirementPage]
})
export class PostRequirementPageModule {}
