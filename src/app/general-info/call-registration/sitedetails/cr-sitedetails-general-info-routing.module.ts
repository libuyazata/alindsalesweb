import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CrSiteDetailsGeneralInfoComponent } from './cr-sitedetails-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/sitedetails', 
      component: CrSiteDetailsGeneralInfoComponent, 
      loadChildren: './cr-sitedetails-general-info.module#CrSiteDetailsGeneralInfoModule',
      data: { title: extract('SiteDetailss') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class CrSiteDetailsGeneralInfoRoutingModule { }
