import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GeneralInfoService } from '@app/general-info/general-info.service';
import { CrRelayGeneralInfoComponent } from './cr-relay-general-info.component';
import { DataTableModule } from 'angular-6-datatable';
import { CrRelayGeneralInfoRoutingModule } from './cr-relay-general-info-routing.module';
import { GeneralInfoMenuModule } from '@app/general-info/shared/general-info-menu/general-info-menu.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,   
    FormsModule, 
    DataTableModule,
    ReactiveFormsModule,
    CrRelayGeneralInfoRoutingModule,
    GeneralInfoMenuModule
  ],
  declarations: [
    CrRelayGeneralInfoComponent
  ],
  providers: [
    GeneralInfoService
  ],
  exports:[
    CrRelayGeneralInfoComponent
  ]
})

export class CrRelayGeneralInfoModule { }
