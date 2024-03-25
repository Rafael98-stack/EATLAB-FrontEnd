import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../auth/reservation';
import { Reservationupdatingdto } from '../auth/payloads/recervations/reservationupdatingdto';

@Component({
  selector: 'app-modifica-prenotazione',
  templateUrl: './modifica-prenotazione.component.html',
  styleUrls: ['./modifica-prenotazione.component.scss'],
})
export class ModificaPrenotazioneComponent implements OnInit {
  reservationUpdating: Reservationupdatingdto = {
    date: new Date(),
    persons: 0,
  };
  reservationId: string | undefined;
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.reservationId = params['id'];
    });
  }

  updateReservation(): void {
    this.authSrv
      .updateReservation(this.reservationId, this.reservationUpdating)
      .subscribe(
        (updatedReservation) => {
          console.log(
            'Prenotazione aggiornata con successo:',
            updatedReservation
          );
          this.router.navigate(['/prenotazioni']);
        },
        (error) => {
          console.error(
            "Errore durante l'aggiornamento della prenotazione:",
            error
          );
        }
      );
  }
}
