import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialRequestRoutingModule } from './material-request-routing.module';
import { MaterialRequestComponent } from './material-request.component';
import { MaterialRequestService } from '@app/material-request/material-request.service';
import { CreateMaterialRequestModule } from '@app/shared/components/create-material-requst/create-material-request.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateMaterialRequestDespatchModule } from '@app/shared/components/create-material-requst-despatch/create-material-request-despatch.module';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CreateMaterialRequestModule,
    CreateMaterialRequestDespatchModule,
    NgbModule.forRoot(),
    DataTableModule,
    ReactiveFormsModule,
    MaterialRequestRoutingModule
  ],
  declarations: [
    MaterialRequestComponent
  ],
  providers:[
    MaterialRequestService,
    AlertNotificationService
  ]
})
export class MaterialRequestModule { }
