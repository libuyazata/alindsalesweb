import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { NewWorkDetailsRoutingModule } from './new-work-routing.module';
import { NewWorkDetailsComponent } from './new-work.component';
import { NewWorkDetailsService } from '@app/employee/new-work/new-work.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DownloadReportModule } from '@app/shared/components/download-ctrl/download.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NatureOfJobPipeModule } from '@app/shared/pipes/nature-of-job/nature-of-job-pipe.module';
import { ObservationBeforeMaintenancePipeModule } from '@app/shared/pipes/observation-before-maintenance/observation-before-maintenance-pipe.module';

@NgModule({
  imports: [    
    CommonModule,
    TranslateModule,
    DataTableModule,
    ReactiveFormsModule,
    NewWorkDetailsRoutingModule,
    DownloadReportModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    NatureOfJobPipeModule,
    ObservationBeforeMaintenancePipeModule
  ],
  declarations: [
    NewWorkDetailsComponent
  ],
  providers:[
    NewWorkDetailsService
  ]
})
export class NewWorkDetailsModule { }
