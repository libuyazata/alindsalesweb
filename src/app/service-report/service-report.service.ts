import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

import { BaseService } from './../core/services/base.service';


@Injectable()
export class ServiceReportService extends BaseService {

  studentList: any[];

  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }
  
  public getServiceReportList(data:any): Observable<any>{
    return this.httpClient.get("call/getServiceReportByCallStatus", { params : data});
  }

  public searchServiceReport(data:any): Observable<any>{
	//return this.httpClient.get("call/searchServiceReport", { params : data});
    return this.httpClient.get("call/getAllServiceReport", { params : data});
  }
  public getServiceReportListSearched(data:any): Observable<any>{
	//return this.httpClient.get("call/searchServiceReport", { params : data});
	return this.httpClient.get("call/searchServiceReportTest", { params : data});
  }

  public submitServiceReport(report:any): Observable<any>{
    return this.httpClient.post("call/submitServiceReport", report);
  }
}
