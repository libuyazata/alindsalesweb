import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

import { BaseService } from './../core/services/base.service';


@Injectable()
export class MaterialRequestService extends BaseService {


  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }

  /**
   * Get material requests by search filter
   * @param data 
   */
  public searcMaterialRequest(data:any): Observable<any>{
    return this.httpClient.get("call/getServiceReportByCallStatus", { params : data});
  }

  public getMaterialCategories(data: any) : Observable<any>{
    return this.httpClient.get("mreq/getAllMaterialCategory", { params : data});
  }

  public getStockDetails(data:any): Observable<any> {
    return this.httpClient.get("mreq/getMaterialStockInfoByCategoryId", { params : data });
  }

  public saveMaterialRequst(data: any) : Observable<any> {
    return this.httpClient.post("mreq/saveOrUpdateMaterialRequest", {params : data});
  }
  
  public getAllMaterialRequests(data : any): Observable<any> { 
    return this.httpClient.get("mreq/getAllMaterialRequest", { params : data });
  }

  public deleteMaterialRequest(data : any): Observable<any> { 
    return this.httpClient.get("mreq/deleteMaterialRequestById", { params : data });
  }

  public getCourierList(data : any): Observable<any> { 
    return this.httpClient.get("mreq/getAllCourierServiceDetails?isActive=1", { params : data });
  }

  public saveDespatch(data: any) : Observable<any> {
    return this.httpClient.post("mreq/saveOrUpdateDespatchDetails", {params : data});
  }

  public updateDespatchStatus(data: any) : Observable<any> {
    return this.httpClient.post("mreq/saveOrUpdateDespatchReceivedStatus", {params : data});
  }


}
