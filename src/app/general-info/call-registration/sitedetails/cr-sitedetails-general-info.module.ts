import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'

import { MyDatePickerModule } from 'mydatepicker';

import { GeneralInfoService } from '@app/general-info/general-info.service';
import { CrSiteDetailsGeneralInfoComponent } from './cr-sitedetails-general-info.component';
import { DataTableModule } from 'angular-6-datatable';
import { CrSiteDetailsGeneralInfoRoutingModule } from './cr-sitedetails-general-info-routing.module';
import { GeneralInfoMenuModule } from '@app/general-info/shared/general-info-menu/general-info-menu.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,   
    DataTableModule,
    FormsModule, 
    ReactiveFormsModule,
    CrSiteDetailsGeneralInfoRoutingModule,
    GeneralInfoMenuModule
  ],
  declarations: [
    CrSiteDetailsGeneralInfoComponent
  ],
  providers: [
    GeneralInfoService
  ],
  exports:[
    CrSiteDetailsGeneralInfoComponent
  ]
})

export class CrSiteDetailsGeneralInfoModule { }
