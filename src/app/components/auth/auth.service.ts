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
import { Reservationcreationdto } from './payloads/recervations/reservationcreationdto';
import { Reservation } from './reservation';
import { Reservationupdatingdto } from './payloads/recervations/reservationupdatingdto';
import { UpdatingProfile } from './updating-profile';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURl;

  user$ = new BehaviorSubject<boolean>(false);

  private accessTokenSubject = new BehaviorSubject<string>('');

  currentUserType: string = '';

  private accessToken: string | null;

  currentUserTypeAsObs: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  currentUserAvatar$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  updatedUser: any;

  constructor(private http: HttpClient) {
    this.accessToken = localStorage.getItem('accessToken');
    this.currentUserType = localStorage.getItem('currentUserType') || '';
    this.currentUserTypeAsObs.next(localStorage.getItem('currentUserType'));
    this.user$.next(!!this.accessToken);
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}auth/login/user`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('userId', response.id);
          localStorage.setItem('currentUserType', response.userType);
          this.currentUserType = response.userType;
          console.log('User Type:', response.userType);
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
      newUser.password,
      newUser.avatar
    );
    user.type = 'CUSTOMER';
    user.id = uuidv4();
    user.role = 'USER';
    this.typeUser('CUSTOMER');
    this.currentUserAvatar$.next(user.avatar);
    console.log(this.currentUserAvatar$);
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
      newUser.password,
      newUser.avatar
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
  typeUserAsObs(): Observable<string | null> {
    return this.currentUserTypeAsObs.asObservable();
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUserType');
    this.accessToken = null;
    this.user$.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.asObservable();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  ///////////////////////////////////// PROFILO /////////////////////////////////////

  getMyProfile(): Observable<User> {
    this.accessToken = localStorage.getItem('accessToken');
    if (!this.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.http.get<User>(`${this.apiUrl}users/me`, { headers });
  }

  updateProfile(updatedUser: UpdatingProfile): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });

    return this.http
      .put<User>(`${this.apiUrl}users/me`, updatedUser, { headers })
      .pipe(
        catchError((error) => {
          console.error("Errore durante l'aggiornamento del profilo:", error);
          throw error;
        })
      );
  }

  //////////////////////////////// RESTAURANTS  /////////////////////////////////////////////////////////////////////////

  getRestaurants(
    page: number = 0,
    size: number = 10,
    orderBy: string = 'id'
  ): Observable<Restaurant[]> {
    this.accessToken = localStorage.getItem('accessToken');
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

  ////////////////////////////////// RESERVATIONS /////////////////////////////////////////////////

  createReservation(
    restaurantId: string | undefined,
    reservationDto: Reservationcreationdto
  ): Observable<Reservation | null> {
    const reservations: Reservation = new Reservation(
      reservationDto.date,
      reservationDto.persons
    );
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('AccessToken non presente nel localStorage');
      return of(null);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    const url = `${this.apiUrl}reservations/creation/${restaurantId}`;

    return this.http.post<Reservation>(url, reservations, { headers }).pipe(
      catchError((error) => {
        console.error('Errore durante la creazione della prenotazione:', error);

        return of(new Reservation(new Date(), 0));
      })
    );
  }

  getMyReservations(): Observable<Reservation[]> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found.');
      return throwError('Access token not found.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .get<Reservation[]>(`${this.apiUrl}reservations/myreservations`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching reservations:', error);
          throw error;
        })
      );
  }

  deleteReservation(reservationId: string): Observable<void> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found in localStorage');
      return throwError('Access token not found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}reservations/${reservationId}`;

    return this.http.delete<void>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error deleting reservation:', error);
        throw error;
      })
    );
  }

  updateReservation(
    reservationId: string | undefined,
    updatedReservation: Reservationupdatingdto
  ): Observable<Reservation | null> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('AccessToken non presente nel localStorage');
      return of(null);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}reservations/${reservationId}`;

    return this.http
      .put<Reservation>(url, updatedReservation, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            "Errore durante l'aggiornamento della prenotazione:",
            error
          );
          return of(null);
        })
      );
  }
}
