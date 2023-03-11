import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CrCustomerJobNatureGeneralInfoComponent } from './cr-customerjobnature-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/customerjobnature', 
      component: CrCustomerJobNatureGeneralInfoComponent, 
      loadChildren: './cr-customerjobnature-general-info.module#CrCustomerJobNatureGeneralInfoModule',
      data: { title: extract('Nature of Job') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class CrCustomerJobNatureGeneralInfoRoutingModule { }
