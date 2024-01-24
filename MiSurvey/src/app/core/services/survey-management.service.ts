import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class SurveyManagementService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.SURVEY}`;

  constructor(private http: HttpClient) {}

  getSurveys(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getSurveyById(surveyId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${surveyId}`, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateSurvey(surveyId: number, surveyData: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${surveyId}`, surveyData, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  createSurvey(surveyData: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, surveyData, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  deleteSurvey(surveyId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${surveyId}`, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }


}