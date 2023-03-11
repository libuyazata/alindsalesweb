import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { WorkDetailsRoutingModule } from './work-details-routing.module';
import { WorkDetailsComponent } from './work-details.component';
import { WorkDetailsService } from '@app/work-details/work-details.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DownloadReportModule } from '@app/shared/components/download-ctrl/download.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DataTableModule,
    ReactiveFormsModule,
    WorkDetailsRoutingModule,    
    NgMultiSelectDropDownModule,
    DownloadReportModule,
  ],
  declarations: [
    WorkDetailsComponent
  ],
  providers:[
    WorkDetailsService
  ]
})
export class WorkDetailsModule { }
