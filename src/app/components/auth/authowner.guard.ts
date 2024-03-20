import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthownerGuard implements CanActivate {
  constructor(private authSrv: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authSrv.isLoggedIn() && this.authSrv.currentUserType === 'OWNER') {
      return true;
    } else {
      alert('Non puoi accedere a questa pagina. \nAccedi o Registrati');
      return this.router.createUrlTree(['/login']);
    }
  }
}
