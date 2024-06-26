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
      .put<any>(`${this.apiUrl}/${surveyId}`, surveyData, {
        withCredentials: true,
      })
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

  sendSurveyEmail(surveyID: string, emailData: string): Observable<any> {
    const url = `${this.apiUrl}/send`;
    const payload = {
      SurveyID: surveyID,
      EmailData: emailData,
    };
    return this.http.post<any>(url, payload, { withCredentials: true }).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getSurveySummaryById(surveyId: number): Observable<any> {
    const url = `${this.apiUrl}/summary/${surveyId}`;
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteSurveyQuestion(questionId: number): Observable<any> {
    return this.http.delete<any>(
      `${apiConstants.BACKEND_API.BASE_API_URL}/questions/${questionId}`,
      { withCredentials: true }
    );
  }

  getSurveyResponseCount(surveyId: number): Observable<any> {
    const url = `${apiConstants.BACKEND_API.BASE_API_URL}/responses/count/${surveyId}`; // Adjust the endpoint to match your backend API
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  getSurveyDetailsByResponseId(responseId: number): Observable<any> {
    const url = `${this.apiUrl}/summary-response/${responseId}`;
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  checkIfQuestionHasResponses(questionId: number): Observable<boolean> {
    const url = `${apiConstants.BACKEND_API.BASE_API_URL}/questions/has-responses/${questionId}`;
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map((response) => response.hasResponses),
      catchError((error) =>
        throwError(() => new Error('Failed to check question responses'))
      )
    );
  }

  uploadImage(surveyId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    return this.http
      .post(
        `${apiConstants.BACKEND_API.BASE_API_URL}/image/upload-survey-image/${surveyId}`,
        formData,
        { withCredentials: true }
      )
      .pipe(
        catchError((error) =>
          throwError(() => new Error('Failed to upload image'))
        )
      );
  }
}
