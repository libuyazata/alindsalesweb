import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { ObmGeneralInfoComponent } from './obm-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/obm', 
      component: ObmGeneralInfoComponent, 
      loadChildren: './obm-general-info.module#ObmGeneralInfoModule',
      data: { title: extract('Observation Before Maintenance') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class ObmGeneralInfoRoutingModule { }
