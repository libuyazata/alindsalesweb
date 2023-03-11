import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'

import { MyDatePickerModule } from 'mydatepicker';

import { DesignationGeneralInfoComponent } from './designation-general-info.component';
import { GeneralInfoService } from '@app/general-info/general-info.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,   
    FormsModule, 
    ReactiveFormsModule 
  ],
  declarations: [
    DesignationGeneralInfoComponent
  ],
  providers: [
    GeneralInfoService
  ],
  exports:[
    DesignationGeneralInfoComponent
  ]
})

export class DesignationGeneralInfoModule { }
