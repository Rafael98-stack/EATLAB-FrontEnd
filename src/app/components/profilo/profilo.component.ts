import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../auth/user';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.scss'],
})
export class ProfiloComponent implements OnInit {
  user: User | undefined;

  constructor(
    private authSrv: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSrv.getMyProfile().subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error('Errore durante il recupero del profilo:', error);
      }
    );
  }
}
