import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent {
  username: string = '';
  password: string = '';
  ime: string = '';
  prezime: string = '';
  email: string = '';
  adresa: string = '';
  telefon: string = '';
  pol: string = '';
  kartica: string = '';
  picture: File | null = null;
  error: string = '';
  uploadedImageUrl: String | ArrayBuffer | null = null;
  cardIconUrl: string | null = null;

  captcha: string | null = null;

  allowedFileTypes: string[] = ['image/jpeg', 'image/png'];
  maxFileSize: number = 5 * 1024 * 1024; // 5 MB

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!this.allowedFileTypes.includes(file.type)) {
        this.error = 'Invalid file type. Only JPG and PNG are allowed.';
        this.picture = null;
        return;
      }
      if (file.size > this.maxFileSize) {
        this.error = 'File size exceeds the maximum limit of 5 MB.';
        this.picture = null;
        return;
      }

      const reader = new FileReader();

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
          this.error = 'Image dimensions must be between 100x100px and 300x300px.';
          this.uploadedImageUrl = reader.result;
          this.picture = null;
        } else {
          reader.onloadend = () => {
            this.uploadedImageUrl = reader.result; // This will be a data URL
            //this.uploadImage(reader.result as string);
          };
          //this.picture = file;
          //this.uploadedImageUrl = img.src; // Set the uploaded image URL
          reader.readAsDataURL(file);
          this.error = ''; // Clear any previous error messages
        }
      };
    }
  }



  validatePassword(password: string): boolean {
    const passwordPattern = /^[A-Z](?=(.*[a-z]){3,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,9}$|^[a-z](?=(.*[a-z]){2,})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
    return passwordPattern.test(password);
  }

  determineCardType() {
    const value = this.kartica;
    const dinersPattern = /^(300|301|302|303|36\d|38\d)\d{12}$/;
    const masterCardPattern = /^(51|52|53|54|55)\d{14}$/;
    const visaPattern = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;

    if (dinersPattern.test(value)) {
      this.cardIconUrl = 'assets/diners.png';
    } else if (masterCardPattern.test(value)) {
      this.cardIconUrl = 'assets/mastercard.png';
    } else if (visaPattern.test(value)) {
      this.cardIconUrl = 'assets/visa.png';
    } else {
      this.cardIconUrl = null;
    }
  }

  registracija() {
    if (!this.username || !this.password || !this.ime || !this.prezime || !this.email || !this.adresa || !this.telefon || !this.pol || !this.kartica) {
      this.error = 'Niste uneli sve podatke!';
      return;
    }

    if (!this.validatePassword(this.password)) {
      this.error = 'Lozinka је obavezna i mora imati od 6 do 10 karaktera, bar jedno veliko slovo, tri mala slova, jedan broj i jedan specijalni karakter i mora počinjati slovom!';
      return;
    }

    // Set default image URL if no image is uploaded
    const imageUrl = this.uploadedImageUrl || 'assets/default-profile.png';

    this.userService.register(this.username, this.password, this.ime, this.prezime, this.email, this.telefon, this.adresa, this.pol, this.kartica, this.uploadedImageUrl || '/assets/anon.jpg').subscribe(
      data => {
      if (data == 0) {
        //this.uploadedImageUrl = data.user.profilnaSlika; // Assuming the response contains the URL of the uploaded picture
        alert("Zahtev je poslat");
        console.log(data);
        this.router.navigate(['']);
      } else {
        this.error = 'Došlo je do greške prilikom registracije!';
      }
    }, (error: any) => {
      this.error = error.message ?? 'Došlo je do greške prilikom registracije!';
    });
  }
}
