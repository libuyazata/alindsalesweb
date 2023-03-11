import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { NewWorkDetailsComponent } from './new-work.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'new-work', 
      component: NewWorkDetailsComponent, 
      loadChildren: './new-work.module#NewWorkDetailsModule',
      data: { title: extract('new-work') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class NewWorkDetailsRoutingModule { }
