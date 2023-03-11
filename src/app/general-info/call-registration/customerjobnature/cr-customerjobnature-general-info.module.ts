import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'

import { MyDatePickerModule } from 'mydatepicker';

import { GeneralInfoService } from '@app/general-info/general-info.service';
import { CrCustomerJobNatureGeneralInfoComponent } from './cr-customerjobnature-general-info.component';
import { DataTableModule } from 'angular-6-datatable';
import { CrCustomerJobNatureGeneralInfoRoutingModule } from './cr-customerjobnature-general-info-routing.module';
import { GeneralInfoMenuModule } from '@app/general-info/shared/general-info-menu/general-info-menu.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,   
    DataTableModule,
    FormsModule, 
    ReactiveFormsModule,
    CrCustomerJobNatureGeneralInfoRoutingModule,
    GeneralInfoMenuModule
  ],
  declarations: [
    CrCustomerJobNatureGeneralInfoComponent
  ],
  providers: [
    GeneralInfoService
  ],
  exports:[
    CrCustomerJobNatureGeneralInfoComponent
  ]
})

export class CrCustomerJobNatureGeneralInfoModule { }
