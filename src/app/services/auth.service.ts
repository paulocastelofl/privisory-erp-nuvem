import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { IUsuario } from '../helpers/models/IUsusario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  protected readonly apiUrl = `${environment.api.url}`;
  public islogout: boolean = false;
  public isRefreshPermissions = new BehaviorSubject<boolean>(true);

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) { }

  get getLocalStorageUserERP(): any | undefined {
    let user: IUsuario | undefined = localStorage.getItem('user-erp-nuvem-user') ? JSON.parse(localStorage.getItem('user-erp-nuvem-user') || "") : undefined;
    return user;
  }

  get getJwtToken(): string | undefined {
    let tokenJwt: any | undefined = localStorage.getItem('user-erp-nuvem-jwt') ? JSON.parse(localStorage.getItem('user-erp-nuvem-jwt') || "") : undefined;
    return tokenJwt.token;
  }

  authenticUser(endpoint: string, data: any): Observable<any> {

    const url = `${this.apiUrl}/${endpoint}`;
    return this.httpClient.post<any>(url, data)
      .pipe(
        tap({
          next: response => {
           this.setLocalStorageJWTERP(response);
          },
          error: error => {
            this.handleError(error)
          },
        }),
        catchError(this.handleError)
      );
  }

  setLocalStorageJWTERP = (data: any) => localStorage.setItem('user-erp-nuvem-jwt', JSON.stringify(data));
  setLocalStorageUserERP = (data: any) => localStorage.setItem('user-erp-nuvem-user', JSON.stringify(data));

  isLogged() {
    if (this.getLocalStorageUserERP) {
      let tokenPayload = this.parseJwt(this.getJwtToken ?? "")
      const expirationTime = tokenPayload.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime > expirationTime) return false;
      return true;
    }

    return false;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  logoutSSOUser() {
    localStorage.removeItem('user-erp-nuvem-jwt');
    this.islogout = true;
    if (!this.isLogged()) this.router.navigate(['/login']);
  }

  private parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }
}
