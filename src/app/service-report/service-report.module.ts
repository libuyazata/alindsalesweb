import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ServiceReportRoutingModule } from './service-report-routing.module';
import { ServiceReportComponent } from './service-report.component';
import { ServiceReportService } from '@app/service-report/service-report.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { DownloadReportModule } from '@app/shared/components/download-ctrl/download.module';
import { NatureOfJobPipeModule } from '@app/shared/pipes/nature-of-job/nature-of-job-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DataTableModule,
    ReactiveFormsModule,
    ServiceReportRoutingModule,
    DownloadReportModule,
    NatureOfJobPipeModule
  ],
  declarations: [
    ServiceReportComponent
  ],
  providers:[
    ServiceReportService
  ]
})
export class ServiceReportModule { }
