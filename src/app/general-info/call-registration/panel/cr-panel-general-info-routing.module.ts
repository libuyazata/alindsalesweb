import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CrPanelGeneralInfoComponent } from './cr-panel-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/panel', 
      component: CrPanelGeneralInfoComponent, 
      loadChildren: './cr-panel-general-info.module#CrPanelGeneralInfoModule',
      data: { title: extract('Panels') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class CrPanelGeneralInfoRoutingModule { }
