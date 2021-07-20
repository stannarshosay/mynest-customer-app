import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CloseRequirementPage } from './close-requirement.page';

const routes: Routes = [
  {
    path: '',
    component: CloseRequirementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CloseRequirementPageRoutingModule {}
