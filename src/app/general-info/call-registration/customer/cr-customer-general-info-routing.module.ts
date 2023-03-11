import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CrCustomerGeneralInfoComponent } from './cr-customer-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/customer', 
      component: CrCustomerGeneralInfoComponent, 
      loadChildren: './cr-customer-general-info.module#CrCustomerGeneralInfoModule',
      data: { title: extract('Customer Info') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class CrCustomerGeneralInfoRoutingModule { }
