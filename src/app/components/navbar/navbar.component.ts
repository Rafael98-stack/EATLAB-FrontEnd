import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  utente!: User | null;

  isAuthenticated$: Observable<boolean> | undefined;

  currentUserType$: Observable<string> | undefined;

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authSrv.user$;
    this.currentUserType$ = this.authSrv.typeUserAsObs();
    console.log(this.currentUserType$);
  }

  logout() {
    this.authSrv.logout();
    this.router.navigate(['/']);
  }
}
