import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

import { BaseService } from './../core/services/base.service';


@Injectable()
export class WorkDetailsService extends BaseService {  

  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }  

  public getWorkDetailsList(data:any): Observable<any>{
    return this.httpClient.get("call/getAllWorkDetails");
  }
  
  public searchWorkAllotDetails(data:any): Observable<any>{
    return this.httpClient.get("call/searchWorkAllotDetails", { params : data});
  }

  public allotEmployees(data:any): Observable<any>{
    return this.httpClient.post("call/saveOrUpdateAllottedEmployees",  { params: data });
  }
}
