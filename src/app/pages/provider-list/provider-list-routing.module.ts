import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderListPage } from './provider-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderListPageRoutingModule {}
