import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseService } from '@app/core/services/base.service';

@Injectable()
export class CreateMaterialRequestService extends BaseService {  

  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }

  public submitEmployeeDetails(employeeData:any): Observable<any> {
    return this.httpClient.post("saveOrUpdateUser", employeeData);
  }
  
  public getEmployeeDetailsById(employeeId:any): Observable<any> {
    return this.httpClient.get("getUserByUserId", { params : employeeId });
  }
}
