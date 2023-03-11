import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MyDatePickerModule } from 'mydatepicker';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { DataTableModule } from 'angular-6-datatable';
import { ProjectService } from '@app/project/project.service';
import { UserProjectAllocationModule } from '@app/shared/components/user-project-allocation/user-project-allocation.module';
import { ProjectDocumentsModule } from '@app/shared/components/project-documents/project-docs.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DataTableModule,
    ProjectRoutingModule,    
    NgbModule.forRoot(),
    MyDatePickerModule,
    ReactiveFormsModule,
    UserProjectAllocationModule,
    ProjectDocumentsModule
  ],
  declarations: [
    ProjectComponent
  ],
  providers: [
    ProjectService
  ]
})
export class ProjectModule { }
