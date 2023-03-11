import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseService } from '@app/core/services/base.service';

@Injectable()
export class CallRegistrationService extends BaseService {  

  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }

  public submitCallRegistrationDetails(callRegData:any): Observable<any> {
    return this.httpClient.post("call/saveOrUpdateCallDetails", callRegData);
  }
  
  public getCustomerDetails(): Observable<any> {
    return this.httpClient.get("call/getAllCustomerDetails");
  }
  
  public getAllBoardDivisionDetails(): Observable<any> {
    return this.httpClient.get("call/getAllBoardDivisionDetails");
  }
  
  public getAllRelayDetails(): Observable<any> {
    return this.httpClient.get("call/getAllRelayDetails");
  }

  public getAllPanelDetails(): Observable<any> {
    return this.httpClient.get("call/getAllPanelDetails");
  }

  public getNatureOfJobs(): Observable<any> {
    return this.httpClient.get("util/getAllNatureOfJobsCallReg?isActive=1");
  }

  public getAllCustomerSiteDetails(): Observable<any> {
    return this.httpClient.get("call/getAllCustomerSiteDetails");
  }
}
