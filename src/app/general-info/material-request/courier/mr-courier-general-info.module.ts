import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'

import { MyDatePickerModule } from 'mydatepicker';

import { GeneralInfoService } from '@app/general-info/general-info.service';
import { MrCourierGeneralInfoComponent } from './mr-courier-general-info.component';
import { DataTableModule } from 'angular-6-datatable';
import { MrCourierGeneralInfoRoutingModule } from './mr-courier-general-info-routing.module';
import { GeneralInfoMenuModule } from '@app/general-info/shared/general-info-menu/general-info-menu.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,   
    DataTableModule,
    FormsModule, 
    ReactiveFormsModule,
    MrCourierGeneralInfoRoutingModule,
    GeneralInfoMenuModule
  ],
  declarations: [
    MrCourierGeneralInfoComponent
  ],
  providers: [
    GeneralInfoService
  ],
  exports:[
    MrCourierGeneralInfoComponent
  ]
})

export class MrCourierGeneralInfoModule { }
