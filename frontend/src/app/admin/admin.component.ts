import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import User from '../models/user';
import * as bootstrap from 'bootstrap';
import Firma from '../models/firma';
import Usluga from '../models/usluga';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private service: UserService, private router: Router, private route: ActivatedRoute) { }

  users: User[] = [];
  user: User = new User();
  firma: Firma = new Firma();
  firme: Firma[] = []
  dekorateri: User[] = [];
  newUsluga: Usluga = new Usluga();
  usluge: Usluga[] = [];


  ngOnInit(): void {
    const ulogovan = localStorage.getItem('ulogovan');
    if (!ulogovan) {
      this.router.navigate(['']);
      return;
    }
    //console.log(ulogovan)
    this.service.getUser(ulogovan).subscribe(
      (user: User) => {
      if (user.tip !== 'admin') {
        this.router.navigate(['']);
        return;
      }
      },
      (error: any) => {
      console.error('Greska pri dohvatanju korisnika.', error);
      this.router.navigate(['']);
      }
    );
    this.service.dohvatiKorisnike().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error: any) => {
        console.error('Greska pri dohvatanju korisnika.', error);
      }
    );
    this.service.dohvatiDekoratere().subscribe(
      (dekorateri: User[]) => {
        this.dekorateri = dekorateri;
      },
      (error: any) => {
        console.error('Greska pri dohvatanju dekoratera.', error);
      }
    );

    this.service.dohvatiFirme().subscribe(
      (firme: Firma[]) => {
        this.firme = firme;
      },
      (error: any) => {
        console.error('Greska pri dohvatanju firmi.', error);
      }
    );

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        document.getElementById(fragment)?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

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

  allowedFileTypes: string[] = ['image/jpeg', 'image/png'];
  maxFileSize: number = 5 * 1024 * 1024; // 5 MB


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

    this.service.register2(this.username, this.password, this.ime, this.prezime, this.email, this.telefon, this.adresa, this.pol, this.kartica, this.uploadedImageUrl || '/assets/anon.jpg').subscribe(
      data => {
      if (data == 0) {
        //this.uploadedImageUrl = data.user.profilnaSlika; // Assuming the response contains the URL of the uploaded picture
        alert("Dekorater je dodat");
        console.log(data);
        this.ngOnInit();
        this.uploadedImageUrl = "";
        this.router.navigate(["admin"], {
          fragment: 'profil'
        });
      } else {
        this.error = 'Došlo je do greške prilikom registracije!';
      }
    }, (error: any) => {
      this.error = error.message ?? 'Došlo je do greške prilikom registracije!';
    });
  }

  setSelectedUser(user: User): void {
    this.user = user;
  }

  validateCreditCard(value: string) {
    const dinersPattern = /^(300|301|302|303|36\d|38\d)\d{12}$/;
    const masterCardPattern = /^(51|52|53|54|55)\d{14}$/;
    const visaPattern = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;

    if (dinersPattern.test(value)) {
      return true;
    } else if (masterCardPattern.test(value)) {
      return true;
    } else if (visaPattern.test(value)) {
      return true;
    } else {
      return false;
    }
  }


  izmeniKorisnika(): void {
    const creditCardInput = document.getElementById('creditCard');
    const emailInput = document.getElementById('email');
    const form = document.getElementById('editProfileForm');

    // Basic email validation
    if (emailInput && (emailInput as HTMLInputElement).value && !(emailInput as HTMLInputElement).checkValidity()) {
      emailInput.classList.add('is-invalid');
      emailInput.focus();
      return;
    }

    if (emailInput) {
      emailInput.classList.remove('is-invalid');
    }

    // Basic credit card validation
    if (creditCardInput && (creditCardInput as HTMLInputElement).value && !this.validateCreditCard((creditCardInput as HTMLInputElement).value)) {
      creditCardInput.classList.add('is-invalid');
      creditCardInput.focus();
      return;
    }

    if (creditCardInput) {
      creditCardInput.classList.remove('is-invalid');
    }

    if ((form as HTMLFormElement).checkValidity()) {
      // Handle form submission or update logic
      this.service.azurirajKorisnika(
        this.user.korisnickoIme,
        this.user.lozinka,
        this.user.ime,
        this.user.prezime,
        this.user.tip,
        this.user.email,
        this.user.brojTelefona,
        this.user.adresa,
        this.user.pol,
        this.user.brojKreditneKartice,
        this.user.profilnaSlika,
        this.user.blokiran,
        this.user.firma
      ).subscribe(response => {
        if (response.success) {
          this.ngOnInit();
          alert('Korisnik je uspešno ažuriran!');
        } else {
          alert('Ažuriranje neuspešno.');
        }
      }, error => {
        console.error('Greška:', error);
        alert('Greška prilikom ažuriranja.');
      });
    } else {
      (form as HTMLFormElement).reportValidity(); // Show other validation errors
    }


  }

  deaktivirajKorisnika(korisnickoIme: string): void {
    this.service.deaktivirajKorisnika(korisnickoIme).subscribe(
      () => {
        const index = this.users.findIndex((u: User) => u.korisnickoIme === korisnickoIme);
        if (index !== -1) {
          this.users.splice(index, 1);
        }
      },
      (error: any) => {
        console.error('Error deactivating user', error);
      }
    );
  }

  prihvatiKorisnika(korisnickoIme: string): void {
    const userToUpdate = this.users.find(u => u.korisnickoIme === korisnickoIme);
    if (userToUpdate) {
      userToUpdate.blokiran = 0;
      this.service.azurirajKorisnika(
        userToUpdate.korisnickoIme,
        userToUpdate.lozinka,
        userToUpdate.ime,
        userToUpdate.prezime,
        userToUpdate.tip,
        userToUpdate.email,
        userToUpdate.brojTelefona,
        userToUpdate.adresa,
        userToUpdate.pol,
        userToUpdate.brojKreditneKartice,
        userToUpdate.profilnaSlika,
        userToUpdate.blokiran,
        userToUpdate.firma
      ).subscribe(
        (updatedUser: User) => {
          this.ngOnInit()
          alert("Korisnik prihvacen!")
        },
        (error: any) => {
          console.error('Greska pri prihvatanju korisnika', error);
        }
      );
    }
  }

  odbijKorisnika(korisnickoIme: string): void {
    const userToUpdate = this.users.find(u => u.korisnickoIme === korisnickoIme);
    if (userToUpdate) {
      userToUpdate.blokiran = 2;
      this.service.azurirajKorisnika(
        userToUpdate.korisnickoIme,
        userToUpdate.lozinka,
        userToUpdate.ime,
        userToUpdate.prezime,
        userToUpdate.tip,
        userToUpdate.email,
        userToUpdate.brojTelefona,
        userToUpdate.adresa,
        userToUpdate.pol,
        userToUpdate.brojKreditneKartice,
        userToUpdate.profilnaSlika,
        userToUpdate.blokiran,
        userToUpdate.firma
      ).subscribe(
        (updatedUser: User) => {
          this.ngOnInit()
          alert("Korisnik odbijen!")
        },
        (error: any) => {
          console.error('Greska pri prihvatanju korisnika', error);
        }
      );
    }
  }

  onDekoraterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (input.checked) {
      this.firma.dekorateri.push(value);
    } else {
      this.firma.dekorateri = this.firma.dekorateri.filter(d => d !== value);
    }
  }

  addUsluga() {
    if (this.newUsluga.naziv!="" && this.newUsluga.cena!= 0) {
      // Add the new usluga to the usluge array
      this.usluge.push(this.newUsluga);
      //console.log(this.newUsluga)
      //console.log(this.usluge)
      // Reset the input fields
      this.newUsluga = new Usluga();
    } else {
      this.error = "Naziv i cena usluge su obavezni.";
    }
  }


  dodajFirmu(): void {
    if (!this.firma.naziv || !this.firma.adresa || !this.firma.lokacija || !this.firma.kontakt || !this.firma.datumOdmoraStart || !this.firma.datumOdmoraEnd || !this.firma.dekorateri || !this.usluge) {
      this.error = 'Niste uneli sve podatke za firmu!';
      return;
    }

    if (new Date(this.firma.datumOdmoraEnd) < new Date(this.firma.datumOdmoraStart)) {
      this.error = 'Datum završetka ne može biti pre datuma početka.';
      return;
    }

    if (this.firma.dekorateri.length < 2) {
      this.error = "Morate odabrati najmanje dva dekoratera.";
      return;
    }

    this.firma.usluge = this.usluge;

    //console.log(this.firma);

    this.service.dodajFirmu(this.firma).subscribe(
      (response: any) => {
      if (response.success) {
        alert('Firma je uspešno dodata!');
        this.firma.dekorateri.forEach(dekorater => {
          const user = this.dekorateri.find(d => d.korisnickoIme === dekorater);
          if (user) {
            user.blokiran = 5;
            user.firma = this.firma.naziv;
            this.service.azurirajKorisnika(
              user.korisnickoIme,
              user.lozinka,
              user.ime,
              user.prezime,
              user.tip,
              user.email,
              user.brojTelefona,
              user.adresa,
              user.pol,
              user.brojKreditneKartice,
              user.profilnaSlika,
              user.blokiran,
              user.firma
            ).subscribe(
              (updatedUser: User) => {
                console.log(`Dekorater ${user.korisnickoIme} updated successfully.`);
              },
              (error: any) => {
                console.error(`Error updating dekorater ${user.korisnickoIme}`, error);
              }
            );
          }
        });
        this.firma = new Firma(); // Reset the form
        this.usluge = [];
        this.ngOnInit(); // Refresh the data

        this.router.navigate(["admin"], {
          fragment: 'profil'
        });
      } else {
        this.error = 'Došlo je do greške prilikom dodavanja firme!';
      }
      },
      (error: any) => {
      console.error('Greška prilikom dodavanja firme:', error);
      this.error = 'Došlo je do greške prilikom dodavanja firme!';
      }
    );

  }


  logout() {
    localStorage.removeItem('ulogovan');
    this.router.navigate(['']);
  }

}


