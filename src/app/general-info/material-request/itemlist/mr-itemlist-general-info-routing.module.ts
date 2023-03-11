import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { MrItemListGeneralInfoComponent } from './mr-itemlist-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/mr-itemlist', 
      component: MrItemListGeneralInfoComponent, 
      loadChildren: './mr-itemlist-general-info.module#MrItemListGeneralInfoModule',
      data: { title: extract('Material Request Item') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class MrItemListGeneralInfoRoutingModule { }
