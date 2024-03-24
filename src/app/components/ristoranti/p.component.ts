import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Restaurant } from '../auth/restaurant';

@Component({
  selector: 'app-ristoranti',
  templateUrl: './p.component.html',
  styleUrls: ['./p.component.scss'],
})
export class RistorantiComponent implements OnInit {
  restaurants$: Observable<Restaurant[]> | undefined;

  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurants$ = this.authSrv.getRestaurants();
    this.restaurants$.subscribe(
      (data) => console.log(data),
      (error) => console.error('Error fetching restaurants:', error)
    );
  }
}
