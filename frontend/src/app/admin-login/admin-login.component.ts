import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
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
          if (response.user.tip != 'admin') {
            this.error = 'Ovo je prijava za admina!';
          } else {
            localStorage.setItem('ulogovan', response.user.korisnickoIme);
            console.log(response.user.korisnickoIme);
            console.log(response.user.tip);
            this.router.navigate(["/admin"]);
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
