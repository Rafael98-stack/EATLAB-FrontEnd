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
