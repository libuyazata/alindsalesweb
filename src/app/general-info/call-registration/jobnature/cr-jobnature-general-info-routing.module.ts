import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CrJobNatureGeneralInfoComponent } from './cr-jobnature-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/jobnature', 
      component: CrJobNatureGeneralInfoComponent, 
      loadChildren: './cr-jobnature-general-info.module#CrJobNatureGeneralInfoModule',
      data: { title: extract('JobNatures') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class CrJobNatureGeneralInfoRoutingModule { }
