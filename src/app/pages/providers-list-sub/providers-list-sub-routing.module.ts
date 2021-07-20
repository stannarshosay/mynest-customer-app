import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvidersListSubPage } from './providers-list-sub.page';

const routes: Routes = [
  {
    path: '',
    component: ProvidersListSubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvidersListSubPageRoutingModule {}
