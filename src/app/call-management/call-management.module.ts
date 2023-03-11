import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CallManagementRoutingModule } from './call-management-routing.module';
import { CallManagementComponent } from './call-management.component';
import { CallManagementService } from '@app/call-management/call-management.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
//import { VirtualScrollModule } from 'angular2-virtual-scroll';
//import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DownloadReportModule } from '@app/shared/components/download-ctrl/download.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgbModule.forRoot(),
    DataTableModule,
    ReactiveFormsModule,
    CallManagementRoutingModule,
    DownloadReportModule,
    //VirtualScrollModule,
    //AngularMultiSelectModule,
    NgMultiSelectDropDownModule,
  ],
  declarations: [
    CallManagementComponent
  ],
  providers:[
    CallManagementService
  ]
})
export class CallManagementModule { }
