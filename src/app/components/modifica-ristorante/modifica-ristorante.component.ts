import { Component, OnInit } from '@angular/core';
import { RestaurantUpdatingDTO } from '../auth/payloads/restaurants/restaurant-updating-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Restaurant } from '../auth/restaurant';

@Component({
  selector: 'app-modifica-ristorante',
  templateUrl: './modifica-ristorante.component.html',
  styleUrls: ['./modifica-ristorante.component.scss'],
})
export class ModificaRistoranteComponent implements OnInit {
  restaurantId: string | undefined;
  restaurantDto: RestaurantUpdatingDTO = {
    logo: '',
    title: '',
    description: '',
    telephone_contact: '',
    seat: 0,
    address: '',
    city: '',
  };

  errorMessage: string | undefined;

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

  onLogoSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.restaurantDto.logo = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  loadRestaurantDetails(): void {
    if (!this.restaurantId) {
      console.error('ID del ristorante non definito.');
      return;
    }
    this.authSrv.getRestaurantById(this.restaurantId).subscribe(
      (restaurant: Restaurant) => {
        this.populateDtoFromRestaurant(restaurant);
      },
      (error) => {
        console.error(
          'Errore durante il recupero dei dettagli del ristorante:',
          error
        );
        this.errorMessage =
          'Si è verificato un errore durante il recupero dei dettagli del ristorante.';
      }
    );
  }

  populateDtoFromRestaurant(restaurantDto: RestaurantUpdatingDTO): void {
    this.restaurantDto.logo = restaurantDto.logo;
    this.restaurantDto.title = restaurantDto.title;
    this.restaurantDto.description = restaurantDto.description;
    this.restaurantDto.telephone_contact = restaurantDto.telephone_contact;
    this.restaurantDto.seat = restaurantDto.seat;
    this.restaurantDto.address = restaurantDto.address;
    this.restaurantDto.city = restaurantDto.city;
  }

  onSubmit(): void {
    if (!this.restaurantId) {
      console.error('ID del ristorante non definito.');
      return;
    }

    this.authSrv
      .updateRestaurant(this.restaurantId, this.restaurantDto)
      .subscribe((updatedRestaurant: Restaurant | null) => {
        if (updatedRestaurant) {
          console.log('Ristorante aggiornato con successo:', updatedRestaurant);
          this.router.navigate(['/ituoiristoranti']);
        } else {
          this.errorMessage =
            "Si è verificato un errore durante l'aggiornamento del ristorante.";
        }
      });
  }
}
