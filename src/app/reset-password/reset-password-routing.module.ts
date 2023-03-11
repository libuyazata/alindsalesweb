import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ResetPasswordComponent } from './reset-password.component';

const routes: Routes = [
  { path: 'reset-password', component: ResetPasswordComponent, 
  loadChildren: './reset-password.module#ResetPasswordModule', data: { title: extract('Reset Password') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ResetPasswordRoutingModule { }
