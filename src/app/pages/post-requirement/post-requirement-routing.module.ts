import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostRequirementPage } from './post-requirement.page';

const routes: Routes = [
  {
    path: '',
    component: PostRequirementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRequirementPageRoutingModule {}
