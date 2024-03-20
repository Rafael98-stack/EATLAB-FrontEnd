import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';
import { Authlogin } from './authlogin';
import { AuthData } from './auth-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURl;

  user$ = new BehaviorSubject<boolean>(false);

  private accessTokenSubject = new BehaviorSubject<string>('');

  currentUserType: string = '';

  currentUserTypeAsObs: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}auth/login/user`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('userId', response.id);
          this.user$.next(true);
        }),
        catchError((error) => {
          console.error('Error during login:', error);
          alert('Credenziali Errate');
          return of(null);
        })
      );
  }

  registerCustomer(newUser: any): Observable<any> {
    const user: User = new User(
      newUser.name,
      newUser.surname,
      newUser.email,
      newUser.password
    );
    user.type = 'CUSTOMER';
    user.id = uuidv4();
    user.role = 'USER';
    this.typeUser('CUSTOMER');
    return this.http
      .post<any>(`${this.apiUrl}auth/register/customer`, user)
      .pipe(
        catchError((error) => {
          console.error('Error during registration:', error);
          return of(null);
        })
      );
  }

  registerOwner(newUser: any): Observable<any> {
    const user: User = new User(
      newUser.name,
      newUser.surname,
      newUser.email,
      newUser.password
    );
    user.type = 'OWNER';
    user.id = uuidv4();
    user.role = 'USER';
    this.typeUser('OWNER');
    return this.http.post<any>(`${this.apiUrl}auth/register/owner`, user).pipe(
      catchError((error) => {
        console.error('Error during registration:', error);
        return of(null);
      })
    );
  }

  typeUser(type: string) {
    return (
      type &&
      (this.currentUserType = type) &&
      this.currentUserTypeAsObs.next(type)
    );
  }
  typeUserAsObs(): Observable<string> {
    return this.currentUserTypeAsObs.asObservable();
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    this.user$.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.asObservable();
  }

  getAccessToken(): string {
    return this.accessTokenSubject.value;
  }
}
