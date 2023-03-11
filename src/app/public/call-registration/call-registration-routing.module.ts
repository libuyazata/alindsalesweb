import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CallRegistrationComponent } from './call-registration.component';

const routes: Routes = [
  //Route.withShell([
    { path: 'call-registration', component: CallRegistrationComponent, 
    loadChildren: './call-registration.module#CallRegistrationModule',data: { title: extract('Call Registration') } }
  //])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CallRegistrationRoutingModule { }
