import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit {

  korisnik: string | null = null;

  constructor(private service: UserService, private router: Router) { }

  ngOnInit(): void {
    this.korisnik = localStorage.getItem('ulogovan');
    const ulogovan = localStorage.getItem('ulogovan');
    if (!ulogovan) {
      this.router.navigate(['']);
      return;
    }
  }


  validatePassword(password: string): boolean {
    const passwordPattern = /^[A-Z](?=(.*[a-z]){3,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,9}$|^[a-z](?=(.*[a-z]){2,})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
    return passwordPattern.test(password);
  }

  newPassword: string = "";
  oldPassword: string = "";
  confirmPassword: string = "";

  error: string = "";

  promenaLozinke() {

    if (this.oldPassword == "" || this.newPassword == "" || this.confirmPassword == "") {
      this.error = "Niste uneli sve podatke!";
      return;
    }

    if (!this.validatePassword(this.newPassword)) {
      this.error = "Nova lozinka ne ispunjava kriterijume.";
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = "Lozinke se ne podudaraju.";
      return;
    }

    // Add logic to change the password here
    if (this.korisnik === null) {
      this.error = "Korisnik nije ulogovan.";
      return;
    }

    this.service.promeniLozinku(this.korisnik, this.oldPassword, this.newPassword).subscribe(
      response => {
        if (response.success) {
          console.log("Password changed successfully");
          this.router.navigate(['/login']);
        } else {
          this.error = response.message;
          console.log(this.error);
        }
      },
      error => {
        this.error = "Došlo je do greške prilikom promene lozinke.";
      }
    );

    this.error = ""; // Clear any previous errors

  }
}
