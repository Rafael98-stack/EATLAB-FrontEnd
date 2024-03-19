import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURl;
  jwtHelper = new JwtHelperService();
  private authSubj = new BehaviorSubject<null | User>(null);
  user!: User;
  user$ = this.authSubj.asObservable();
  private readonly tokenKey = '';
  constructor(private http: HttpClient, private router: Router) {}

  //   login(data: {name: string,surname: string,email: string,password: string}) {
  // return this.http.post<User>(`${this.apiUrl}login`, data).pipe(tap((data)=>{
  //   console.log(data);
  // this.authSubj.next(data);
  // this.user = data;
  // console.log(this.user);
  // }),
  // catchError(this.errors);
  // )
  //     }

  registerCustomer(userDetails: any): Observable<any> {
    const newUser: User = new User(
      userDetails.name,
      userDetails.surname,
      userDetails.email,
      userDetails.password
    );
    newUser.type = 'CUSTOMER';
    newUser.role = 'USER';
    newUser.id = uuidv4();
    return this.http.post<any>(`${this.apiUrl}auth/register/customer`, newUser);
  }

  registerOwner(userDetails: any): Observable<any> {
    const newUser: User = new User(
      userDetails.name,
      userDetails.surname,
      userDetails.email,
      userDetails.password
    );
    newUser.type = 'OWNER';
    newUser.role = 'USER';
    newUser.id = uuidv4();
    return this.http.post<any>(`${this.apiUrl}auth/register/owner`, newUser);
  }

  private decodeToken(token: string): User | null {
    try {
      const user: User = JSON.parse(atob(token.split('.')[1]));
      return user;
    } catch (error) {
      console.error('Errore durante la decodifica del token:', error);
      return null;
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}auth/login`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response && response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            const decodedToken = this.decodeToken(response.token);
            if (decodedToken) {
              this.authSubj.next(decodedToken);
            }
            this.router.navigate(['/']);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authSubj.next(null);
    this.router.navigate(['/']);
  }

  private errors(err: any) {
    switch (err.error) {
      case 'Email already exists':
        return throwError('Email gia registrata');
        break;

      case 'Email format is invalid':
        return throwError('Formato mail non valido');
        break;

      default:
        return throwError('Errore nella chiamata');
        break;
    }
  }
}
