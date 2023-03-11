import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { MaterialRequestComponent } from './material-request.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'material-request', 
      component: MaterialRequestComponent, 
      loadChildren: './material-request.module#MaterialRequestModule',
      data: { title: extract('material request') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class MaterialRequestRoutingModule { }
