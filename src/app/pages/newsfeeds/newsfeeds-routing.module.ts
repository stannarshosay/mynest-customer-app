import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsfeedsPage } from './newsfeeds.page';

const routes: Routes = [
  {
    path: '',
    component: NewsfeedsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsfeedsPageRoutingModule {}
