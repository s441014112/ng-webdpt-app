import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ITemplate } from '../interface';


@Injectable({ providedIn: 'root' })
export class TemplateService {

  private templateUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) { }

  /** GET templates from the server */
  getTemplates(): Observable<ITemplate[]> {
    return this.http.get<ITemplate[]>(this.templateUrl)
      .pipe(
        catchError(this.handleError<ITemplate[]>('getTemplates', []))
      );
  }

  /** GET Template by id. Will 404 if id not found */
  getTemplate(id: string): Observable<ITemplate> {
    const url = `${this.templateUrl}/${id}`;
    return this.http.get<ITemplate>(url).pipe(
      catchError(this.handleError<ITemplate>(`getTemplate id=${id}`))
    );
  }

  /** POST: add a new template to the server */
  addTemplate(template: ITemplate): Observable<ITemplate> {
    return this.http.post<ITemplate>(this.templateUrl, template, this.httpOptions).pipe(
      catchError(this.handleError<ITemplate>('addTemplate'))
    );
  }

  /** PUT: update the template on the server */
  updateTemplate(template: ITemplate): Observable<any> {
    return this.http.put(this.templateUrl, template, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateTemplate'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
