import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Reservation } from '../auth/reservation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './pp.component.html',
  styleUrls: ['./pp.component.scss'],
})
export class PrenotazioniComponent implements OnInit {
  reservations: Reservation[] = [];

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMyReservations();
  }

  loadMyReservations(): void {
    this.authSrv.getMyReservations().subscribe(
      (reservations) => {
        this.reservations = reservations;
        console.log('Prenotazioni caricate con successo:', reservations);
      },
      (error) => {
        console.error(
          'Errore durante il caricamento delle prenotazioni:',
          error
        );
      }
    );
  }

  deleteReservation(reservationId: string): void {
    this.authSrv.deleteReservation(reservationId).subscribe(
      () => {
        console.log('Prenotazione eliminata con successo');
        // Aggiorna la lista delle prenotazioni dopo l'eliminazione
        this.loadMyReservations();
      },
      (error) => {
        console.error(
          "Errore durante l'eliminazione della prenotazione:",
          error
        );
      }
    );
  }

  navigateToEdit(reservationId: string): void {
    this.router.navigate(['/modificaprenotazione', reservationId]);
  }
}
