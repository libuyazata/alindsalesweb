import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'

import { MyDatePickerModule } from 'mydatepicker';

import { GeneralInfoService } from '@app/general-info/general-info.service';
import { CrJobNatureGeneralInfoComponent } from './cr-jobnature-general-info.component';
import { DataTableModule } from 'angular-6-datatable';
import { CrJobNatureGeneralInfoRoutingModule } from './cr-jobnature-general-info-routing.module';
import { GeneralInfoMenuModule } from '@app/general-info/shared/general-info-menu/general-info-menu.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,   
    DataTableModule,
    FormsModule, 
    ReactiveFormsModule,
    CrJobNatureGeneralInfoRoutingModule,
    GeneralInfoMenuModule
  ],
  declarations: [
    CrJobNatureGeneralInfoComponent
  ],
  providers: [
    GeneralInfoService
  ],
  exports:[
    CrJobNatureGeneralInfoComponent
  ]
})

export class CrJobNatureGeneralInfoModule { }
