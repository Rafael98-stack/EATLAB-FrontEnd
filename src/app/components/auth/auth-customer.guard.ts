import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthCustomerGuard implements CanActivate {
  constructor(private authSrv: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authSrv.user$.pipe(
      take(1),
      map((utente) => {
        if (utente && utente.type === 'CUSTOMER') {
          return true;
        } else {
          alert(
            'Per Visualizzare questa risorsa devi essere loggato! Ed essere Un Cliente \nAccedi o Registrati'
          );
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
