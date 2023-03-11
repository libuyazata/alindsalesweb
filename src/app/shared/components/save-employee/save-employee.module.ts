import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';

import { SaveEmployeeService } from './save-employee.service';
import { SaveEmployeeComponent } from './save-employee.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,   
    FormsModule, 
    MyDatePickerModule,
    ReactiveFormsModule 
  ],
  declarations: [
    SaveEmployeeComponent
  ],
  providers: [
    SaveEmployeeService
  ],
  exports:[
    SaveEmployeeComponent
  ]
})
export class SaveEmployeeModule { }
