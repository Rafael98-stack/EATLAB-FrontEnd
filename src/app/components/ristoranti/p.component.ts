import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Restaurant } from '../auth/restaurant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ristoranti',
  templateUrl: './p.component.html',
  styleUrls: ['./p.component.scss'],
})
export class RistorantiComponent implements OnInit {
  restaurants$: Observable<Restaurant[]> | undefined;
  currentUserType$: Observable<string> | undefined;
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.currentUserType$ = this.authSrv.currentUserTypeAsObs;
  }

  loadRestaurants(): void {
    this.restaurants$ = this.authSrv.getRestaurants();
    this.restaurants$.subscribe(
      (data) => console.log(data),
      (error) => console.error('Error fetching restaurants:', error)
    );
  }

  navigateToReservation(restaurantId: string): void {
    this.router.navigate(['/creaprenotazione', restaurantId]);
  }
}
