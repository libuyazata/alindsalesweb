import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { NgxSpinnerService } from 'ngx-spinner';

import { AuthenticationService } from './../authentication/authentication.service';

/**
 * Prefixes all requests with `environment.serverUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {

  count = 0;    
  constructor(private spinner: NgxSpinnerService, private authService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.count++;
    this.spinner.show();
    const authToken = this.authService.getToken();
    
    if(authToken){
      request = request.clone({
        url: environment.serverUrl + request.url,
        setHeaders: {
          Authorization: `token ${authToken}`,
          "token" : authToken
        }
      });
    } else {
      request = request.clone({
        url: environment.serverUrl + request.url
      });
    }
    return next.handle(request).pipe(tap(
        //event => console.log(event),
        //error => console.log(error)
      ), finalize(() => {
        this.count--;
        if ( this.count == 0 ) this.spinner.hide ()
      })
    );
  }
}

