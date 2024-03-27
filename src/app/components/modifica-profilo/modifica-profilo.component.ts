import { Component, OnInit } from '@angular/core';
import { UpdatingProfile } from '../auth/updating-profile';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modifica-profilo',
  templateUrl: './modifica-profilo.component.html',
  styleUrls: ['./modifica-profilo.component.scss'],
})
export class ModificaProfiloComponent implements OnInit {
  updatingUser: UpdatingProfile = { name: '', surname: '', email: '' };

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.authSrv.updateProfile(this.updatingUser).subscribe(
      (response) => {
        console.log('Profilo aggiornato con successo:', response);
      },
      (error) => {
        console.error("Errore durante l'aggiornamento del profilo:", error);
      }
    );
  }
}
