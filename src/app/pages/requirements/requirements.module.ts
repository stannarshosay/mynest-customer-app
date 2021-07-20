import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequirementsPageRoutingModule } from './requirements-routing.module';

import { RequirementsPage } from './requirements.page';
import { MaterialModule } from 'src/app/components/material.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgxPaginationModule,
    IonicModule,
    RequirementsPageRoutingModule
  ],
  declarations: [RequirementsPage]
})
export class RequirementsPageModule {}
