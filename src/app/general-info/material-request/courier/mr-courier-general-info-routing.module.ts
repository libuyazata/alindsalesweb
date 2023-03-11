import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { MrCourierGeneralInfoComponent } from './mr-courier-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/mr-courier', 
      component: MrCourierGeneralInfoComponent, 
      loadChildren: './mr-courier-general-info.module#MrCourierGeneralInfoModule',
      data: { title: extract('Material Request Item') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class MrCourierGeneralInfoRoutingModule { }
