import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, switchMap } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSrv: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authSrv.user$.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          console.log(request);
          return next.handle(request);
        } else {
          // Ottieni il token solo se l'utente è autenticato
          const accessToken = this.authSrv.getAccessToken(); // Modifica questo metodo in base alla tua implementazione di AuthService
          const newReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log(request);
          console.log(newReq);
          return next.handle(newReq);
        }
      })
    );
  }
}
