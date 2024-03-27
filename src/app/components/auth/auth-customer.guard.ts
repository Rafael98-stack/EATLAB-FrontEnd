import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
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
    if (
      this.authSrv.isLoggedIn() &&
      this.authSrv.currentUserType === 'CUSTOMER'
    ) {
      return true;
    } else {
      alert('Non puoi accedere a questa pagina. \nAccedi o Registrati');
      return this.router.createUrlTree(['/']);
    }
  }
}
