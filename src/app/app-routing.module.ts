import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RistorantiComponent } from './components/ristoranti/p.component';
import { PrenotazioniComponent } from './components/prenotazioni/pp.component';
import { AuthGuard } from './components/auth/auth.guard';
import { AuthCustomerGuard } from './components/auth/auth-customer.guard';
import { FormsModule } from '@angular/forms';
import { RegisterOwnerComponent } from './components/auth/register-owner/register-owner.component';
import { ITuoiRistorantiComponent } from './components/i-tuoi-ristoranti/i-tuoi-ristoranti.component';
import { AuthownerGuard } from './components/auth/authowner.guard';
import { CreazioneRistoranteComponent } from './components/creazione-ristorante/creazione-ristorante.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'ristoranti',
    component: RistorantiComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'prenotazioni',
    component: PrenotazioniComponent,
    canActivate: [AuthCustomerGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'registerowner',
    component: RegisterOwnerComponent,
  },
  {
    path: 'ituoiristoranti',
    component: ITuoiRistorantiComponent,
    canActivate: [AuthownerGuard],
  },
  {
    path: 'creazioneristorante',
    component: CreazioneRistoranteComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
