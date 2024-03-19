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
  newUser: AuthData = { name: '', surname: '', email: '', password: '' };
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  registerCustomer(): void {
    this.authService.registerCustomer(this.newUser).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
      }
    );
  }

  registerOwner(): void {
    this.authService.registerOwner(this.newUser);
  }
}
