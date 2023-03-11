import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

import { BaseService } from './../core/services/base.service';

@Injectable()
export class ProjectService extends BaseService {


  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }


  public getProjectList(): Observable<any>{
    return this.httpClient.get("getAllProjectDetails");
  } 

  public getProjectResourceList(data:any): Observable<any>{
    return this.httpClient.get("getProjectResourceDeploymentByProjectId", { params : data});
  } 
  
  public saveProject(projectData:any): Observable<any>{
    return this.httpClient.post("saveOrUpdateProjectDetails", projectData);
  }
  
  public assignProjectResource(projectResourceInfo:any): Observable<any>{
    return this.httpClient.post("addProjectResources", projectResourceInfo);
  }

  public removeProjectResource(projectResourceInfo:any): Observable<any>{
    return this.httpClient.post("deleteProjectResource", projectResourceInfo);
  }

  public getProjectByResource(projectResourceInfo:any): Observable<any>{
    return this.httpClient.get("getLiveProjectDetailsByUserId", { params : projectResourceInfo });
  }  

  public saveProjectPayment(projectPaymentInfo:any): Observable<any>{
    return this.httpClient.post("saveOrUpdateProjectPaymentStatus", projectPaymentInfo);
  }

  public getProjectPaymentStatusList(projectPaymentInfo:any): Observable<any>{
    return this.httpClient.get("getProjectPaymentStatusList", { params : projectPaymentInfo });
  }
}
