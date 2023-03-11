import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

import { BaseService } from './../core/services/base.service';


@Injectable()
export class GeneralInfoService extends BaseService {


  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }

  //#region Relay API Calls 
  public getRelayList(data:any): Observable<any>{
    return this.httpClient.get("call/getAllRelayDetails", data);
  }

  public saveOrUpdateRelay(data: any) : Observable<any> {
    return this.httpClient.post("call/saveOrUpdateRelayDetails", data);
  }

  public deleteRelay(data:any): Observable<any>{
    return this.httpClient.get("call/deleteRelayDetails", { params : data});
  }
  //#endregion

  //#region Panel API Calls 
  public getPanelList(data:any): Observable<any>{
    return this.httpClient.get("call/getAllPanelDetails", data);
  }

  public saveOrUpdatePanel(data: any) : Observable<any> {
    return this.httpClient.post("call/saveOrUpdatePanelDetails", data);
  }

  public deletePanel(data:any): Observable<any>{
    return this.httpClient.get("call/deletePanelDetails", { params : data});
  }
  //#endregion

  //#region Customer API Calls 
  public getCustomerList(data:any): Observable<any>{
    return this.httpClient.get("call/getAllCustomerDetails", data);
  }

  public saveOrUpdateCustomer(data: any) : Observable<any> {
    return this.httpClient.post("call/saveOrUpdateCusotmerDetails", data);
  }

  public deleteCustomer(data:any): Observable<any>{
    return this.httpClient.get("call/deleteCustomerDetails", { params : data});
  }
  //#endregion

  //#region Board Division API Calls
  public getBoardDivisionList(data:any): Observable<any>{
    return this.httpClient.get("call/getAllBoardDivisionDetails", data);
  }

  public saveOrUpdateBoardDivision(data: any) : Observable<any> {
    return this.httpClient.post("call/saveOrUpdateBoardDivisionDetails", data);
  }

  public deleteBoardDivision(data:any): Observable<any>{
    return this.httpClient.get("call/deleteBoardDivisionDetails", { params : data});
  }
  //#endregion
  

  //#region Site Details API Calls
  public getAllCustomerSiteDetails(data:any): Observable<any>{
    return this.httpClient.get("call/getAllCustomerSiteDetails", data);
  }

  public saveOrUpdateCustomerSiteDetails(data: any) : Observable<any> {
    return this.httpClient.post("call/saveOrUpdateCustomerSiteDetails", data);
  }

  public deleteCustomerSiteDetailsById(data:any): Observable<any>{
    return this.httpClient.get("call/deleteCustomerSiteDetailsById", { params : data});
  }
  //#endregion

  //#region JobNature API Calls
  public getJobNatureList(data:any): Observable<any>{
    return this.httpClient.get("call/getAllNatureOfJobs", data);
  }

  public saveOrUpdateJobNature(data: any) : Observable<any> {
    return this.httpClient.post("call/saveOrUpdateNatureOfJobs", data);
  }

  public deleteJobNature(data:any): Observable<any>{
    return this.httpClient.get("call/deleteNatureOfJobs", { params : data});
  }
  //#endregion

  //#region Observation Before Maitenance API Calls
  public getObmList(data:any): Observable<any>{
    return this.httpClient.get("call/getAllObservationBeforeMaintanence", data);
  }

  public saveOrUpdateObm(data: any) : Observable<any> {
    return this.httpClient.post("call/saveOrUpdateObervationBeforeMaintanence", data);
  }

  public deleteObm(data:any): Observable<any>{
    return this.httpClient.get("call/deleteObservationBeforeMaintanence", { params : data});
  }
  //#endregion

  //#region Material Request Items API Calls
  public getMaterialStockList(data:any): Observable<any>{
    return this.httpClient.get("mreq/getMaterialStockInfo?isActive=1", data);
  }

  public saveOrUpdateMaterialStock(data: any) : Observable<any> {
    return this.httpClient.post("mreq/saveOrUpdateMaterialStock", data);
  }

  public deleteMaterialStock(data:any): Observable<any>{
    return this.httpClient.get("mreq/deleteMaterialStockInfo", { params : data});
  }
  //#endregion


  //#region Material Request Item Category API Calls
  public getMaterialStockCategoryList(data:any): Observable<any>{
    return this.httpClient.get("mreq/getAllMaterialCategory?isActive=1", { params : data});
  }

  public saveOrUpdateMaterialStockCategory(data: any) : Observable<any> {
    return this.httpClient.post("mreq/saveOrUpdateMaterialCategory", data);
  }

  public deleteMaterialStockCategory(data:any): Observable<any>{
    return this.httpClient.get("mreq/deleteMaterialCategory", { params : data});
  }
  //#endregion

  //#region Material Request Item Category API Calls
  public getCourierList(data:any): Observable<any>{
    return this.httpClient.get("mreq/getAllCourierServiceDetails", { params : data});
  }

  public saveOrUpdateCourier(data: any) : Observable<any> {
    return this.httpClient.post("mreq/saveOrUpdateCourierServiceDetails", data);
  }

  public deleteCourier(data:any): Observable<any>{
    return this.httpClient.get("mreq/deleteCourierServiceDetailsById", { params : data});
  }
  //#endregion

   //#region Customer JobNature API Calls # for call registration
  public getCustomerJobNatureList(data:any): Observable<any>{
    return this.httpClient.get("util/getAllNatureOfJobsCallReg?isActive=1", { params : data});
  }

  public saveOrUpdateCustomerJobNature(data: any) : Observable<any> {
    return this.httpClient.post("util/saveOrUdpateNatureOfJobsCallReg", data);
  }

  public deleteCustomerCustomerJobNature(data:any): Observable<any>{
    return this.httpClient.get("util/deleteNatureOfJobsCallReg", { params : data});
  }
  //#endregion
}
