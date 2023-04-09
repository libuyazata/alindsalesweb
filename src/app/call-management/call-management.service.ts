import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

import { BaseService } from './../core/services/base.service';


@Injectable()
export class CallManagementService extends BaseService {

  studentList: any[];

  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }
  
  public getCallManagementList(data:any): Observable<any>{
    //return this.httpClient.get("call/getCallDetails/",  { params: data });
    return this.httpClient.get("call/getCallDetailsTest/",  { params: data });
  }

  public allotEmployees(data:any): Observable<any>{
    return this.httpClient.post("call/saveOrUpdateAllottedEmployees",  { params: data });
  }
  
  public getCallDetailByCdId(data:any): Observable<any>{
    return this.httpClient.get("call/getCallDetailByCdId",  { params: data });
  }
  
  public searchCallManagement(url:string, params:any): Observable<any>{
    return this.httpClient.get(url);
  }
    
  public deleteCallDetails(data:any): Observable<any>{
    return this.httpClient.post("call/deleteCallDetails/", data);
  }

  public saveGuranteePeriod(data:any): Observable<any>{
    return this.httpClient.post("call/updateGuranteePeriod",  { params: data });
  }
  public updateCallDetails(updateCallDetails:any): Observable<any>{
    return this.httpClient.post("call/updateCallDetails/", updateCallDetails);
  }
}
