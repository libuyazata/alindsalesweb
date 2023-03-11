import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CallRegistrationRoutingModule } from './call-registration-routing.module';
import { CallRegistrationComponent } from './call-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CallRegistrationService } from '@app/public/call-registration/call-registration.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import {AutocompleteLibModule} from 'angular-ng-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule, 
    CallRegistrationRoutingModule,
    ReactiveFormsModule,
    NgbModule,    
    //AutocompleteLibModule,
  ],
  declarations: [
    CallRegistrationComponent
  ],
  providers: [
    CallRegistrationService
  ],
  exports:[
    CallRegistrationComponent
  ]
})
export class CallRegistrationModule { }
