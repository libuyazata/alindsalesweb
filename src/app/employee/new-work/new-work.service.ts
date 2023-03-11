import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

import { BaseService } from './../../core/services/base.service';


@Injectable()
export class NewWorkDetailsService extends BaseService {

  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }  

  public getAllottedWorkDetails(data:any): Observable<any>{
    return this.httpClient.get("call/getAllottedWorkDetailsByEmpId", { params : data});
  }
  
  public getAllottedWorkDetailsByAllotId(data:any): Observable<any>{
    return this.httpClient.get("call/getAllottedWorkByAlId", { params : data});
  }
  
  public getAllObservationBeforeMaintanence(): Observable<any>{
    return this.httpClient.get("call/getAllObservationBeforeMaintanence");
  }

  public getServiceReportByAllotId(data:any): Observable<any>{
    return this.httpClient.get("call/getServiceReportByAlId", { params : data});
  }

  public saveOrUpdateServiceReport(formData:FormData){
    return this.httpClient.post('alindsalesapp/call/saveOrUpdateServiceReport', formData, {reportProgress: true, observe: 'events'});
  }

  public getMinutesofMeetingPrint(data:any): Observable<any>{
    return this.httpClient.get("call/getMinitesOfMettingPDFReport", { params : data});
  }

  public getObmList(data:any): Observable<any>{
    return this.httpClient.get("call/getAllObservationBeforeMaintanence", data);
  }

  public getJobNatureList(data:any): Observable<any>{
    return this.httpClient.get("call/getAllNatureOfJobs", data);
  }
}
