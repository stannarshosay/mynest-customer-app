import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportVendorPageRoutingModule } from './report-vendor-routing.module';

import { ReportVendorPage } from './report-vendor.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ReactiveFormsModule,
    ReportVendorPageRoutingModule
  ],
  declarations: [ReportVendorPage]
})
export class ReportVendorPageModule {}
