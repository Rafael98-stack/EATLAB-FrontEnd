import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-i-tuoi-ristoranti',
  templateUrl: './i-tuoi-ristoranti.component.html',
  styleUrls: ['./i-tuoi-ristoranti.component.scss'],
})
export class ITuoiRistorantiComponent implements OnInit {
  myRestaurants$: Observable<any[]> | undefined;

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.myRestaurants$ = this.authSrv.getMyRestaurants();
  }

  navToCreazioneRistorante(): void {
    this.router.navigate(['/creazioneristorante']);
  }
}
