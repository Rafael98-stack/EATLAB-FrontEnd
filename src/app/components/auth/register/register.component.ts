import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { AuthData } from '../auth-data';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  newUser: AuthData = {
    name: '',
    surname: '',
    email: '',
    password: '',
    avatar: '',
  };
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogoSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.newUser.avatar = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  registerCustomer(): void {
    this.authSrv.registerCustomer(this.newUser).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
      }
    );
  }
}
