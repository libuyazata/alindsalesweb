import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../logger.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private spinner: NgxSpinnerService, 
    private router: Router, private authService : AuthenticationService,
    private alertService: AlertNotificationService) {
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    // console.log("ErrorHandlerInterceptor");
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 700);
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    
    // if(response && response.status && response.status == 401){
    //   alert("Unauthorized error");
    // }
    if (response instanceof HttpErrorResponse) {
      if (response.status === 401) {
        this.alertService.showInfo("Your session has been expired due to inactivity for a certain amount of time. Please login again.", "Session Timeout");
        // alert("Your session has been expired due to inactivity for a certain amount of time. Please login again.")
        this.authService.logout(); // Logout to clear any cached storage data.
        this.router.navigate(['login']);
      }

      else if(response.url.includes('user/getAuthentication') && response.status === 404) {
        this.alertService.showError("Invalid username or password", "Invalid Credentials");
      }

      else if (response.status !== 200 ) {
        this.alertService.showError("Oops! Something went wrong. Please try again", "Error")
      }

    }

    if (!environment.production) {
      // Do something with the error
      log.error('Request error', response);
    }
    throw response;
  }

}
