import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RistorantiComponent } from './components/ristoranti/p.component';
import { PrenotazioniComponent } from './components/prenotazioni/pp.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterOwnerComponent } from './components/auth/register-owner/register-owner.component';
import { HomeComponent } from './components/home/home.component';
import { ITuoiRistorantiComponent } from './components/i-tuoi-ristoranti/i-tuoi-ristoranti.component';
import { CreazioneRistoranteComponent } from './components/creazione-ristorante/creazione-ristorante.component';
import { ModificaRistoranteComponent } from './components/modifica-ristorante/modifica-ristorante.component';

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    NavbarComponent,
    RistorantiComponent,
    PrenotazioniComponent,
    LoginComponent,
    RegisterComponent,
    RegisterOwnerComponent,
    ITuoiRistorantiComponent,
    CreazioneRistoranteComponent,
    ModificaRistoranteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
