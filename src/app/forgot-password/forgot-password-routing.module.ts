import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [
  { path: 'forgot-password', component: ForgotPasswordComponent, 
  loadChildren: './forgot-password.module#ForgotPasswordModule', data: { title: extract('Forgot Password') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ForgotPasswordRoutingModule { }
