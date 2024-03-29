import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean> | undefined;

  currentUserType$!: Observable<string | null>;

  currentUserAvatar$: Observable<string | null> | undefined;
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authSrv.user$;
    this.currentUserType$ = this.authSrv.currentUserTypeAsObs;
    this.currentUserAvatar$ = this.authSrv.currentUserAvatar$;
    console.log(this.currentUserType$);
  }

  navProfilo(): void {
    this.router.navigate(['/myprofile']);
  }

  logout() {
    this.authSrv.logout();
    this.router.navigate(['/']);
  }
}
