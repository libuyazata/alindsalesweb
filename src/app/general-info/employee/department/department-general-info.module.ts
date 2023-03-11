import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DepartementGeneralInfoComponent } from './department-general-info.component';
import { GeneralInfoService } from '@app/general-info/general-info.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,   
    FormsModule, 
    ReactiveFormsModule 
  ],
  declarations: [
    DepartementGeneralInfoComponent
  ],
  providers: [
    GeneralInfoService
  ],
  exports:[
    DepartementGeneralInfoComponent
  ]
})

export class DepartmentGeneralInfoModule { }
