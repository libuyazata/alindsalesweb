import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';

const log = new Logger('Login');

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  version: string = environment.version;
  error: string;
  loginForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private i18nService: I18nService,
              private authenticationService: AuthenticationService,
              private alertService: AlertNotificationService) {
    this.createForm();
  }

  ngOnInit() { }

  submitForgotPassword() {
    let formData = this.loginForm.value;
    let params = {
      username: formData.username,
      emailId: formData.email,
      baseUrl: window.location.origin + "/#/reset-password?req="
    };

    this.authenticationService.doForgetPassword(params).subscribe(
      responseData => { 
        if (responseData && responseData.status == "success") {
          this.alertService.showSuccess("Reset Password link sent to your registered email. Please follow the instructions to reset the password", "Reset Password Link");
          this.router.navigate(["/login"]);
        } else {
          this.alertService.showError(responseData.message, "Reset Password Link");
        }
      }
    )
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', {validators:Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])}]
    });
  }

}
