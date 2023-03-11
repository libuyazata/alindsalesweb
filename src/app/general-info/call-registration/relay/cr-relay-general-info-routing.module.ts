import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CrRelayGeneralInfoComponent } from './cr-relay-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/relay', 
      component: CrRelayGeneralInfoComponent, 
      loadChildren: './cr-relay-general-info.module#CrRelayGeneralInfoModule',
      data: { title: extract('Relays') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class CrRelayGeneralInfoRoutingModule { }
