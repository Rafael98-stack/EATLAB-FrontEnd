import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';
import { v4 as UUID } from 'uuid';
import { Authlogin } from './authlogin';
import { AuthData } from './auth-data';
import { RestaurantCreationDTO } from './payloads/restaurants/restaurant-creation-dto';
import { Restaurant } from './restaurant';
import { RestaurantResponse } from './payloads/restaurants/restaurant-response';
import { RestaurantUpdatingDTO } from './payloads/restaurants/restaurant-updating-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURl;

  user$ = new BehaviorSubject<boolean>(false);

  private accessTokenSubject = new BehaviorSubject<string>('');

  currentUserType: string = '';

  private accessToken: string | null;

  currentUserTypeAsObs: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  constructor(private http: HttpClient) {
    this.accessToken = localStorage.getItem('accessToken');
  }

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
    if (type) {
      this.currentUserType = type;
      this.currentUserTypeAsObs.next(type);
    }
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

  //////////////////////////////// restaurants  /////////////////////////////////////////////////////////////////////////

  getRestaurants(
    page: number = 0,
    size: number = 10,
    orderBy: string = 'id'
  ): Observable<Restaurant[]> {
    if (!this.accessToken) {
      console.error('access token not found.');
      return new Observable<Restaurant[]>();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    const options = {
      headers: headers,
      params: {
        page: page.toString(),
        size: size.toString(),
        orderBy: orderBy,
      },
    };
    return this.http
      .get<RestaurantResponse>(`${this.apiUrl}restaurants`, options)
      .pipe(
        map((response) => response.content),
        catchError((error) => {
          console.error('Error fetching restaurants:', error);
          throw error;
        })
      );
  }

  getMyRestaurants(): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }),
    };
    return this.http.get<any[]>(
      `${this.apiUrl}restaurants/myrestaurants`,
      httpOptions
    );
  }

  getRestaurantById(restaurantId: string): Observable<Restaurant> {
    const url = `${this.apiUrl}restaurants/${restaurantId}`;
    return this.http.get<Restaurant>(url);
  }

  createPostRestaurant(
    restaurantDto: RestaurantCreationDTO
  ): Observable<any[]> {
    const restaurant: Restaurant = new Restaurant(
      restaurantDto.logo,
      restaurantDto.title,
      restaurantDto.description,
      restaurantDto.telephone_contact,
      restaurantDto.seat,
      restaurantDto.address,
      restaurantDto.city
    );
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('AccessToken non presente nel localStorage');
      return of([]);
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
    };

    return this.http
      .post<any>(`${this.apiUrl}restaurants/creation`, restaurant, httpOptions)
      .pipe(
        catchError((error) => {
          console.error('Error during creation of restaurant:', error);
          return of([]);
        })
      );
  }

  updateRestaurant(
    restaurantId: string,
    restaurantDto: RestaurantUpdatingDTO
  ): Observable<Restaurant | null> {
    const accessToken = localStorage.getItem('accessToken');
    const restaurant: Restaurant = new Restaurant(
      restaurantDto.logo,
      restaurantDto.title,
      restaurantDto.description,
      restaurantDto.telephone_contact,
      restaurantDto.seat,
      restaurantDto.address,
      restaurantDto.city
    );
    if (!accessToken) {
      console.error('AccessToken non presente nel localStorage');
      return of(null);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}restaurants/${restaurantId}`;

    return this.http.put<Restaurant>(url, restaurant, { headers }).pipe(
      catchError((error) => {
        console.error("Errore durante l'aggiornamento del ristorante:", error);

        return of(new Restaurant('', '', '', '', 0, '', ''));
      })
    );
  }

  deleteRestaurant(restaurantId: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('AccessToken non presente nel localStorage');
      return throwError('AccessToken non presente nel localStorage');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
    };

    const url = `${this.apiUrl}restaurants/${restaurantId}`;

    return this.http.delete<any>(url, httpOptions).pipe(
      catchError((error) => {
        console.error("Errore durante l'eliminazione del ristorante:", error);
        return throwError(error);
      })
    );
  }
}
