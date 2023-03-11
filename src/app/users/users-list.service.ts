import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

import { BaseService } from './../core/services/base.service';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable()
export class UsersService extends BaseService {

  studentList: any[];

  constructor(public httpClient: HttpClient) { 
    super(httpClient);
  }

  getRandomQuote(context: RandomQuoteContext): Observable<string> {
    return this.httpClient
      .cache()
      .get(routes.quote(context))
      .pipe(
        map((body: any) => body.value),
        catchError(() => of('Error, could not load joke :-('))
      );
  }  

  public getEmployeeList(data:any): Observable<any>{
    return super.getEmployeeList(data)
  } 
  
  public submitEmployeeDetails(employeeData:any): Observable<any>{
    return this.httpClient.post("saveOrUpdateUser", employeeData);
  }

  public deleteEmployee(employeeData:any): Observable<any>{
    return this.httpClient.post("user/deleteEmployee", employeeData);
  }
}
