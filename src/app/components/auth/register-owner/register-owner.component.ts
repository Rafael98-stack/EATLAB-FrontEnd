import { Component, OnInit } from '@angular/core';
import { AuthData } from '../auth-data';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-owner',
  templateUrl: './register-owner.component.html',
  styleUrls: ['./register-owner.component.scss'],
})
export class RegisterOwnerComponent implements OnInit {
  newUser: AuthData = { name: '', surname: '', email: '', password: '' };

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {}

  registerOwner(): void {
    this.authSrv.registerOwner(this.newUser).subscribe(
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
