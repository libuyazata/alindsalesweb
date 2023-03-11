import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { ShowHidePasswordDirective } from '@app/core/directives//showhide-password.directive'
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
// import { debug } from 'util';

const log = new Logger('Login');

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  version: string = environment.version;
  error: string;
  loginForm: FormGroup;
  isLoading = false;

  reqParam : string;

  constructor(private router: Router,
              private route : ActivatedRoute,
              private formBuilder: FormBuilder,
              private i18nService: I18nService,
              private authenticationService: AuthenticationService,
              private alertService: AlertNotificationService) {

    this.route.queryParams.subscribe(params => {
        this.reqParam = params['req'];

        if( ! this.reqParam || this.reqParam == "") {
          this.router.navigate(["/login"]);
        }
    });

    this.createForm();
  }

  ngOnInit() { 
    
  }

  submitResetPassword() {

    let resetData = this.loginForm.value;
    let params = {
      newPassword: resetData.password,
      otp: resetData.otp,
      uuId: this.reqParam
    }

    this.authenticationService.doResetPassword(params).subscribe(
      resetData => { 
        if (resetData && resetData.status == "success") {
          this.alertService.showSuccess(resetData.message, "Reset Password");
          this.router.navigate(["/login"]);
        } else {
          this.alertService.showError(resetData.message, "Reset Password");
        }
      }
    )
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  validPasswords() {
    return (this.loginForm.controls.password.value === this.loginForm.controls.retypePassword.value)
  }
  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
      retypePassword: ['', Validators.required],
      otp: ['', Validators.required]
    });
  }

}
