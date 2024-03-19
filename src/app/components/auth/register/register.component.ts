import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { AuthData } from '../auth-data';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  newUser: AuthData = { name: '', surname: '', email: '', password: '' };
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  registerCustomer(form: NgForm): void {
    this.authService.registerCustomer(form.value).subscribe(
      (response) => {
        console.log('Registration successful', response);
      },
      (error) => {
        console.error('Registration failed', error);
      }
    );
  }

  registerOwner(newUser: AuthData): void {
    this.authService.registerOwner(newUser);
  }
}
