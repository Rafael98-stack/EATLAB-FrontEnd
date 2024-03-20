import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Authlogin } from '../authlogin';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: Authlogin = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(): void {
    this.authService
      .login(this.loginUser.email, this.loginUser.password)
      .subscribe(
        (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
  }
}
