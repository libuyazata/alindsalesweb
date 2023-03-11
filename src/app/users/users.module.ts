import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MyDatePickerModule } from 'mydatepicker';
import {DataTableModule} from "angular-6-datatable";

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { UserRoutingModule } from './users-routing.module';
import { UserListComponent } from './users.component';
import { UsersService } from './users-list.service';
import { DataFilterPipeModule } from '@app/shared/pipes/data-filter/data-filter-pipe.module';
import { SaveEmployeeModule } from '@app/shared/components/save-employee/save-employee.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    UserRoutingModule,
    MyDatePickerModule,
    DataTableModule,
    DataFilterPipeModule,
    ReactiveFormsModule,
    SaveEmployeeModule
  ],
  declarations: [
    UserListComponent
  ],
  providers: [
    UsersService
  ]
})
export class UserListModule { }
