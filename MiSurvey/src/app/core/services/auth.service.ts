import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    // Changed return type to any
    const loginUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.LOGIN}`;
    return this.http
      .post<any>(loginUrl, { username, password }, { withCredentials: true })
      .pipe(
        map((response) => {
          if (response) {
            return response;
          }
        }),
        catchError((error) => {
          console.error('Error during login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    const logoutUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/logout`;
    return this.http
      .post<any>(logoutUrl, {}, { withCredentials: true })
      .pipe(catchError((error) => throwError(() => error)));
  }

  register(userData: {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    username: string;
    password: string;
  }): Observable<any> {
    const registerUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/register`;
    return this.http
      .post<any>(registerUrl, userData, { withCredentials: true })
      .pipe(
        map((response) => {
          if (response.status) {
            return response;
          } 
        }),
        catchError((error) => {
          console.error('Error during registration:', error);
          return throwError(() => error);
        })
      );
  }

  getPermissions(userId: number): Observable<any> {
    return this.http
      .get(
        `${apiConstants.BACKEND_API.BASE_API_URL}/getPermissions/${userId}`,
        { withCredentials: true }
      )
      .pipe(
        catchError((error) => {
          console.error('Error during registration:', error);
          return throwError(() => error);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    const forgotPasswordUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/forgot-password`;
    return this.http
      .post<any>(forgotPasswordUrl, { email }, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Error during password reset request:', error);
          return throwError(() => error);
        })
      );
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(
      `${apiConstants.BACKEND_API.BASE_API_URL}/reset-password/${token}`,
      { password },
      { withCredentials: true }
    );
  }
}
