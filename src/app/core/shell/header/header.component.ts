import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../authentication/authentication.service';
import { I18nService } from '../../i18n.service';
import { SideBarService } from '../sidebar/sidebar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuHidden = true;
  isAdminUser:Boolean;

  isResetPasswordFormVisible = false;
  isFormSubmitInitiated = false;
  public resetPasswordForm : FormGroup;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private i18nService: I18nService,
              public nav: SideBarService,
              public alertService: AlertNotificationService) { }

  ngOnInit() { 
    this.isAdminUser = this.authenticationService.isAdminUser();

    this.resetPasswordForm = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      retypePassword: new FormControl('', Validators.required)
    });
  }

  toggleMenu() {
    this.nav.toggle();
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  openResetPassword() {
    this.isResetPasswordFormVisible = true;
  }

  closeResetPasswordModal() {
    this.isResetPasswordFormVisible = false;
    this.isFormSubmitInitiated = false;
  }

  validPasswords() {
    return (this.resetPasswordForm.controls.newPassword.value === this.resetPasswordForm.controls.retypePassword.value)
  }

  onSubmitResetPassword() {
    this.isFormSubmitInitiated = true;
    if(this.resetPasswordForm.valid) {
      let data = this.resetPasswordForm.value;

      let params = {
        newPassword: data.newPassword,
        currentPassword : data.currentPassword
      }

      this.authenticationService.doResetPersonalPassword(params).subscribe((resp:any)=>{
        if(resp.status == "success") {
          this.alertService.showSuccess("Password reset successful. Please login to continue", "Password Reset");
          this.closeResetPasswordModal();
          this.logout();
        } else {
          this.alertService.showSuccess("Password reset failed. Please try again", "Password Reset");
        }
      });
    }
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string | null {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.name : null;
  }

  get resetForm() { return this.resetPasswordForm.controls; }

  menuButtonClicked() {
    
  }
}
