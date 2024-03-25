import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { RestaurantCreationDTO } from '../auth/payloads/restaurants/restaurant-creation-dto';
import { Reservationcreationdto } from '../auth/payloads/recervations/reservationcreationdto';

@Component({
  selector: 'app-creaprenotazione',
  templateUrl: './creaprenotazione.component.html',
  styleUrls: ['./creaprenotazione.component.scss'],
})
export class CreaprenotazioneComponent implements OnInit {
  reservationDto: Reservationcreationdto = { date: new Date(), persons: 0 };
  restaurantId: string | undefined;
  constructor(
    private router: Router,
    private authSrv: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.restaurantId = params['id'];
    });
  }

  createReservation(): void {
    this.authSrv
      .createReservation(this.restaurantId, this.reservationDto)
      .subscribe(
        (response) => {
          console.log('Prenotazione creata con successo:', response);
          this.router.navigate(['/prenotazioni']);
        },
        (error) => {
          console.error(
            'Errore durante la creazione della prenotazione:',
            error
          );
        }
      );
  }
}
