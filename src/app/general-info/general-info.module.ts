import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentGeneralInfoModule } from './employee/department/department-general-info.module';
import { DesignationGeneralInfoModule } from './employee/designation/designation-general-info.module';
import { CrRelayGeneralInfoModule } from './call-registration/relay/cr-relay-general-info.module';
import { CrPanelGeneralInfoModule } from './call-registration/panel/cr-panel-general-info.module';
import { CrCustomerGeneralInfoModule } from './call-registration/customer/cr-customer-general-info.module';
import { CrBoardDivisionGeneralInfoModule } from './call-registration/boarddivision/cr-boarddivision-general-info.module';
import { CrSiteDetailsGeneralInfoModule } from './call-registration/sitedetails/cr-sitedetails-general-info.module';
import { CrJobNatureGeneralInfoModule } from './call-registration/jobnature/cr-jobnature-general-info.module';
import { ObmGeneralInfoModule } from './mom/obm/obm-general-info.module';
import { MrItemListGeneralInfoModule } from './material-request/itemlist/mr-itemlist-general-info.module';
import { MrCategoryGeneralInfoModule } from './material-request/category/mr-category-general-info.module';
import { MrCourierGeneralInfoModule } from './material-request/courier/mr-courier-general-info.module';
import { CrCustomerJobNatureGeneralInfoRoutingModule } from './call-registration/customerjobnature/cr-customerjobnature-general-info-routing.module';

@NgModule({
  imports: [
    CommonModule,
    //modules in employee menu
    DepartmentGeneralInfoModule,
    DesignationGeneralInfoModule,
    //modules in call registration menu
    CrRelayGeneralInfoModule,
    CrPanelGeneralInfoModule,
    CrCustomerGeneralInfoModule,
    CrBoardDivisionGeneralInfoModule,
    CrSiteDetailsGeneralInfoModule,
    CrJobNatureGeneralInfoModule,
    CrCustomerJobNatureGeneralInfoRoutingModule,
    //Modules in MOM menu
    ObmGeneralInfoModule,
    //Modules in Materal Request Menu
    MrItemListGeneralInfoModule,
    MrCategoryGeneralInfoModule,
    MrCourierGeneralInfoModule,

    TranslateModule,
    NgbModule.forRoot(),
    DataTableModule,
    ReactiveFormsModule,
  ],
  declarations: [
  ],
  providers:[
  ]
})
export class GeneralInfoModule { }
