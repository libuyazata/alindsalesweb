import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { ChartModule } from 'angular-highcharts';
import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BaseComponent } from './core/component/base.component';
import { UserModule } from '@app/employee/user/user.module';
import { UserListModule } from '@app/users/users.module';

import { AttendanceModule } from '@app/attendance/attendance.module';
import { UserInfoModule } from '@app/user-info/user-info.module';
import { NotificationModule } from '@app/notifications/notification.module';

import { NgxSpinnerModule } from 'ngx-spinner';
import { ProjectModule } from '@app/project/project.module';
import { DepartmentModule } from '@app/department/department.module';
import { CallManagementModule } from '@app/call-management/call-management.module';
import { ServiceReportModule } from '@app/service-report/service-report.module';
import { WorkDetailsModule } from '@app/work-details/work-details.module';
import { CallRegistrationModule } from '@app/public/call-registration/call-registration.module';
import { NewWorkDetailsModule } from '@app/employee/new-work/new-work.module';
import { MaterialRequestModule } from '@app/material-request/material-request.module';
import { GeneralInfoModule } from './general-info/general-info.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';



@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule.forRoot(),
    CoreModule,
    SharedModule,
    HomeModule,
    AboutModule,
    ProjectModule,
    LoginModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    AttendanceModule,
    NotificationModule,
    UserModule,
    DepartmentModule,
    ServiceReportModule,
    CallManagementModule,
    CallRegistrationModule,
    WorkDetailsModule,
    NewWorkDetailsModule,
    MaterialRequestModule,
    GeneralInfoModule,
    UserInfoModule,
    UserListModule,    
    AppRoutingModule, 
    NgxSpinnerModule, 
  ],
  declarations: [AppComponent, BaseComponent],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
