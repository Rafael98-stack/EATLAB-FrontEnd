import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-i-tuoi-ristoranti',
  templateUrl: './i-tuoi-ristoranti.component.html',
  styleUrls: ['./i-tuoi-ristoranti.component.scss'],
})
export class ITuoiRistorantiComponent implements OnInit {
  myRestaurants$: Observable<any[]> = new Observable<any[]>();

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.myRestaurants$ =
      this.authSrv.getMyRestaurants() || new Observable<any[]>();
  }

  navToCreazioneRistorante(): void {
    this.router.navigate(['/creazioneristorante']);
  }

  navToModificaRistorante(restaurantId: string) {
    this.router.navigate(['/modificaristorante', restaurantId]);
  }

  deleteRestaurant(restaurantId: string): void {
    this.authSrv.deleteRestaurant(restaurantId).subscribe(
      () => {
        this.myRestaurants$ = this.myRestaurants$.pipe(
          map((restaurants: { id: string }[]) =>
            restaurants.filter((restaurant) => restaurant.id !== restaurantId)
          )
        );
        console.log('Ristorante eliminato con successo:', restaurantId);
      },
      (error) => {
        console.error("Errore durante l'eliminazione del ristorante:", error);
      }
    );
  }
}
