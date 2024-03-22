import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { RestaurantCreationDTO } from '../auth/payloads/restaurants/restaurant-creation-dto';

@Component({
  selector: 'app-creazione-ristorante',
  templateUrl: './creazione-ristorante.component.html',
  styleUrls: ['./creazione-ristorante.component.scss'],
})
export class CreazioneRistoranteComponent implements OnInit {
  newrestaurant: RestaurantCreationDTO = {
    logo: '',
    title: '',
    description: '',
    telephone_contact: '',
    seat: 0,
    address: '',
    city: '',
  };

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogoSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.newrestaurant.logo = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  createRestaurant(): void {
    this.authSrv.createPostRestaurant(this.newrestaurant).subscribe(
      (response) => {
        console.log('Creation of your restaurant successful', response);
        this.router.navigate(['/ituoiristoranti']);
      },
      (error) => {
        console.error('Creation failed', error);
      }
    );
  }
}
