import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequirementsPage } from './requirements.page';

const routes: Routes = [
  {
    path: '',
    component: RequirementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequirementsPageRoutingModule {}
