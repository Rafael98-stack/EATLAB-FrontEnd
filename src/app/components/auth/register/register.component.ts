import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  newUser: User = new User('', '', '', '');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  registerCustomer(): void {
    this.authService.registerCustomer(this.newUser);
  }

  registerOwner(): void {
    this.authService.registerCustomer(this.newUser);
  }
}
