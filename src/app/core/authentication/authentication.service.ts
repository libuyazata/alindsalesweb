import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AuthGroup } from '@app/core/authentication/authorization.types';

export interface Credentials {
  // Customize received credentials here
  userId:number;
  userName: string;
  token: string;
  userRole:number;
  name:string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  private _credentials: Credentials | null;
  private _permissions: Array<string>;
  private _roles: Array<string>;

  constructor(private injector: Injector) {
    this._roles = new Array<string>();
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
      if(this._roles.length == 0){
        this.setRolesAndPermissions(this._credentials);
      }
    }
  }

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    var userName = context.username;
    var password = context.password;

    if(userName == "admin" && password == "admin") {
      // Replace by proper authentication call
      const data = {
        userName: "Administrator", //context.username,
        token: 'xyzabcqwe',
        userRole : 1,
        name : "",
        userId: 1
      };      
      this.setCredentials(data, context.remember);
      return of(data);
    } else if(userName == "Emp" && password == "Emp") {
      // Replace by proper authentication call
      const data = {
        userName: "John Doe", //context.username,
        token: '123456',
        userRole : 3,
        name : "",
        userId: 2
      };      
      this.setCredentials(data, context.remember);
      return of(data);
    }else {
      return of(null);
    }    
  }

  doLoginRequest(context: LoginContext) : Observable<any> {
    let httpClient =  this.injector.get(HttpClient);
    //let loginParams = { "userName": context.username, "viewPass": context.password};
    let loginParams = { "userName": context.username, "password": context.password};
    return httpClient.post<any>("user/getAuthentication",  loginParams );
  }

  doForgetPassword(params: any) {
    let httpClient =  this.injector.get(HttpClient);
    return httpClient.post<any>("user/forgetPassword",  params );
  }

  doResetPassword(params: any) {
    let httpClient =  this.injector.get(HttpClient);
    return httpClient.post<any>("user/forgetPasswordReset",  params );
  }

  doResetPersonalPassword(params: any) {
    let httpClient =  this.injector.get(HttpClient);
    return httpClient.post<any>("user/resetPersonalPassword",  params );
  }

  setRolesAndPermissions(userInfo: Credentials){ 
    if(!this._roles){
      this._roles = new Array<string>();
    }
    if(userInfo && userInfo.userRole == 1) {
      this._roles.push('Admin');
      this._roles.push('Employee');
    } else {
      this._roles.push('Employee');
    }
  }

  hasPermission(authGroup: any) {
    // Check the user roles 
    if (this._roles && this._roles.find(role => {
              return role === authGroup;
         })) {
         return true;
    }
    return false;
    // if (this._permissions && this._permissions.find(permission => {
    //           return permission === authGroup;
    //      })) {
    //      return true;
    // }
    // return false;
  }

  isAdminUser(){
    return (this._credentials.userRole == 1 || this._credentials.userRole == 2)
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this._roles = null;
    this._permissions = null;
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  getToken() : string | null {
    var token = null;
    if(this._credentials) {
      token = this._credentials.token;
    }
    return token;
  }

  saveCredentials(credentials?: Credentials, remember?: boolean){
    this.setCredentials(credentials, remember);
  }
  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

}
