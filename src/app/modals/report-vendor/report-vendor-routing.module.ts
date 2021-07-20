import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportVendorPage } from './report-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: ReportVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportVendorPageRoutingModule {}
