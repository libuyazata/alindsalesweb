import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'

import { MyDatePickerModule } from 'mydatepicker';

import { CreateMaterialRequestComponent } from './create-material-request.component';
import { CreateMaterialRequestService } from './create-material-request.service';

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
    CreateMaterialRequestComponent
  ],
  providers: [
    CreateMaterialRequestService
  ],
  exports:[
    CreateMaterialRequestComponent
  ]
})

export class CreateMaterialRequestModule { }
