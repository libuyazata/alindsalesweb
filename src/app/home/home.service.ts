import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from '@app/core/services/base.service';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable()
export class HomeService extends BaseService {

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

  public getDashboardData(data:any): Observable<any>{
    return this.httpClient.get("getDashBoard");
  }

  /*
  /call/admindashboard 
  /call/getCompletedCalls
  /call/getOnGoingCalls
  /call/getNonAllottedCalls
  */

  public getAdminDashboardData(): Observable<any>{
    return this.httpClient.get("call/admindashboard");
  }

  public getCompletedCalls(): Observable<any>{
    return this.httpClient.get("call/getCompletedCalls");
  }

  public getOnGoingCalls(): Observable<any>{
    return this.httpClient.get("call/getOnGoingCalls");
  }

  public getNonAllottedCalls(): Observable<any>{
    return this.httpClient.get("call/getNonAllottedCalls");
  }
}
