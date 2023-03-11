import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'

import { MyDatePickerModule } from 'mydatepicker';
import { CreateMaterialRequestDespatchComponent } from './create-material-request-despatch.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,   
    FormsModule, 
    SelectDropDownModule,
    MyDatePickerModule,
    ReactiveFormsModule 
  ],
  declarations: [
    CreateMaterialRequestDespatchComponent
  ],
  exports:[
    CreateMaterialRequestDespatchComponent
  ]
})

export class CreateMaterialRequestDespatchModule { }
