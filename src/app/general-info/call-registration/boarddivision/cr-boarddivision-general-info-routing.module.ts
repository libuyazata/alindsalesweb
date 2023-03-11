import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CrBoardDivisionGeneralInfoComponent } from './cr-boarddivision-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/boarddivision', 
      component: CrBoardDivisionGeneralInfoComponent, 
      loadChildren: './cr-boarddivision-general-info.module#CrBoardDivisionGeneralInfoModule',
      data: { title: extract('BoardDivision Info') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class CrBoardDivisionGeneralInfoRoutingModule { }
