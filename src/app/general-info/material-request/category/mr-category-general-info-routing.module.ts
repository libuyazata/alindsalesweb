import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { MrCategoryGeneralInfoComponent } from './mr-category-general-info.component';

const routes: Routes = [
  Route.withShell([
    { 
      path: 'general-info/mr-category', 
      component: MrCategoryGeneralInfoComponent, 
      loadChildren: './mr-category-general-info.module#MrCategoryGeneralInfoModule',
      data: { title: extract('Material Category') } 
    }
  ])  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class MrCategoryGeneralInfoRoutingModule { }
