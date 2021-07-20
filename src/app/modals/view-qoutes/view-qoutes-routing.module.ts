import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewQoutesPage } from './view-qoutes.page';

const routes: Routes = [
  {
    path: '',
    component: ViewQoutesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewQoutesPageRoutingModule {}
