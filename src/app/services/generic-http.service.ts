import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, tap, throwError } from 'rxjs';
import { CustomHttpParamEncoder } from '../helpers/customHttpParamEncoder';
import { environment } from '../../environments/environment';
import { IDataTablesResponse } from '../helpers/models/IDataTableResponse';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService<T> {

  protected readonly apiUrl = `${environment.api.url}`;

  constructor(private http: HttpClient) { }

  private convertObjToHttpParams(query: any) {
    let params = new HttpParams({ encoder: new CustomHttpParamEncoder() });
    if (query) {
      Object.keys(query).forEach(
        (key) => {
          params = params.append(key, query[key]);
        }
      )
    }
    return params;
  }

  getForTable(endpoint: string, args?: any): Observable<any> {
    const pagination = args || { page: 1, limit: 10 };
    const params = this.convertObjToHttpParams(args);

    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get<any>(url, { params }).pipe(
      tap({
        next: response => {
        },
        error: error => {
          console.log('on error', error.message);
        },
        complete: () => { }
      })
    );
  }

  get(endpoint: string, args?: any): Observable<T> {
    const params = this.convertObjToHttpParams(args);

    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get<any>(url, { params }).pipe(
      tap({
        next: response => {
        },
        error: error => {
          console.log('on error', error.message);
        },
        complete: () => { }
      })
    );
  }

  getById(endpoint: string, arg?: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${arg}`;
    return this.http.get<any>(url).pipe(
      tap({
        next: val => { },
        error: error => {
          console.log('on error', error.message);
        },
        complete: () => { }
      })
    );
  }

  getByHashId(endpoint: string, arg?: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}/${arg}`;
    return this.http.get<any>(url).pipe(
      tap({
        next: val => { },
        error: error => {
          console.log('on error', error.message);
        },
        complete: () => { }
      })
    );
  }

  post(endpoint: string, data: T): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post<T>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  put(endpoint: string, data: T, id?: any): Observable<T> {
    const url = id != undefined ? `${this.apiUrl}/${endpoint}/${id}` : `${this.apiUrl}/${endpoint}`;
    return this.http.patch<T>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  delete(endpoint: string, id: number): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  getDataTableResponse(tableQuery: any): Promise<IDataTablesResponse | undefined> {
    return this.http.post<IDataTablesResponse>(`${this.apiUrl}/usuarios/DataTableUsuarios`, tableQuery)
      .pipe(
        retry(1)
      ).toPromise();
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

}