import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router, private userService: UserService) {}
  username: string = '';
  password: string = '';
  error: string = '';
  //admin: boolean = false;
  ngOnInit(): void {}

  login() {
    if (this.username === '' || this.password === '') {
      this.error = 'Niste uneli sve podatke!';
      return;
    }
    this.error = '';
    this.userService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.user) {
          if (response.user.tip === 'admin') {
            this.error = 'Ne možete da se prijavite kao admin!';
          } else {
            localStorage.setItem('ulogovan', response.user.korisnickoIme);
            console.log(response.user.korisnickoIme);
            console.log(response.user.tip);
            this.router.navigate([response.user.tip]);
          }
        } else {
          this.error = 'Loši podaci!';
        }
      },
      (err) => {
        this.error = err.error.message || 'Došlo je do greške!';
      }
    );
  }
}
