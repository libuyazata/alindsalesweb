import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { MonthViewModule } from './components/month-view/month-view.module';
import { UserProjectAllocationModule } from '@app/shared/components/user-project-allocation/user-project-allocation.module';

@NgModule({
  imports: [
    CommonModule,
    MonthViewModule,
    UserProjectAllocationModule,
  ],
  declarations: [
    LoaderComponent
  ],
  exports: [
    LoaderComponent
  ]
})
export class SharedModule { }
