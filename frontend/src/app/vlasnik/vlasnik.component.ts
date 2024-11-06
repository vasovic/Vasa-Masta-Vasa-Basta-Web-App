import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import User from '../models/user';
import Firma from '../models/firma';
import Zakazivanje from '../models/zakazivanje';

@Component({
  selector: 'app-vlasnik',
  templateUrl: './vlasnik.component.html',
  styleUrls: ['./vlasnik.component.css']
})
export class VlasnikComponent implements OnInit {

  korisnik: string | null = null;

  userData: User = new User();
  error: string = '';
  uploadedImageUrl: String | ArrayBuffer | null = null;
  ime: string = "";
  prezime: string = "";
  email: string = "";
  adresa: string = "";
  telefon: string = "";
  kartica: string = "";


  allowedFileTypes: string[] = ['image/jpeg', 'image/png'];
  maxFileSize: number = 5 * 1024 * 1024; // 5 MB

  zakazivanja: Zakazivanje[] = [];
  zavrseneBaste: Zakazivanje[] = []
  filteredBaste: Zakazivanje[] = [];
  basteUprocesu: Zakazivanje[] = []

  constructor(private service: UserService, private router: Router) { }

  ngOnInit(): void {
    this.korisnik = localStorage.getItem('ulogovan');
    const ulogovan = localStorage.getItem('ulogovan');
    if (!ulogovan) {
      this.router.navigate(['']);
      return;
    }
    //console.log(ulogovan)
    this.service.getUser(ulogovan).subscribe(
      (user: User) => {
      if (user.tip !== 'vlasnik') {
        this.router.navigate(['']);
        return;
      }
      },
      (error: any) => {
      console.error('Greska pri dohvatanju korisnika.', error);
      this.router.navigate(['']);
      }
    );
    if (this.korisnik) {
      this.service.getUser(this.korisnik).subscribe(response => {
        this.userData = response;
        //console.log(this.userData)
      });
    }

    this.service.dohvatiFirme().subscribe((data: Firma[]) => {
      this.firme = data;
      this.filteredFirme = data;

      this.firme.forEach(firma => {
        this.fetchDekorateriDetails(firma);
      });
    });

    this.service.dohvatiZakazivanjaA(this.korisnik!).subscribe(
      (data: Zakazivanje[]) => {
        this.zakazivanja = data;
      },
      (error: any) => {
        console.error('Error fetching reservations:', error);
      }
    );
    this.service.dohvatiZavrseneBaste(this.korisnik!).subscribe(
      (data: Zakazivanje[]) => {
        this.zavrseneBaste = data;
        this.filteredBaste = this.zavrseneBaste.filter(basta => {
          const today = new Date();
          return basta.odrzavanje === 0 && (!basta.poslednjeOdrzavanje || new Date(basta.poslednjeOdrzavanje) <= today);
        });
        this.basteUprocesu = this.zavrseneBaste.filter(basta =>{
          const today = new Date();
          return basta.odrzavanje === 1 ||
          (basta.odrzavanje === 0 && basta.poslednjeOdrzavanje && new Date(basta.poslednjeOdrzavanje) > today)
        });
      },
      (error: any) => {
        console.error('Error fetching finished gardens:', error);
      }
    );
  }

  isCancelButtonVisible(datumPocetka: Date): boolean {
    const today = new Date();
    const startDate = new Date(datumPocetka);
    // Check if today's date is at least one day before datumPocetka
    return (startDate.getTime() - today.getTime()) > 86400000; // 86400000 ms in a day
  }

  cancelZakazivanje(zakazivanje: Zakazivanje): void {
    this.service.otkaziZakazivanje(zakazivanje).subscribe(
      response => {
        if (response.success) {
          console.log('Zakazivanje successfully cancelled:', zakazivanje);
          this.ngOnInit()
        } else {
          console.error('Error cancelling zakazivanje:', response.message);
        }
      },
      error => {
        console.error('Error cancelling zakazivanje:', error);
      }
    );
  }


  // Function to determine if the servicing button should appear
  showServisButton(posao: any): boolean {
    if (posao.bazenK === 0 && posao.fontanaK === 0) {
      return false;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (posao.poslednjeOdrzavanje) {
      return new Date(posao.poslednjeOdrzavanje) <= sixMonthsAgo;
    } else {
      return new Date(posao.datumZavrsetka) <= sixMonthsAgo;
    }
  }

  // Function to handle servicing
  zakaziOdrzavanje(posao: any) {
    this.service.getFirma(posao.firma).subscribe((firma: Firma) => {
      const today = new Date();
      const pocetakOdmora = firma.datumOdmoraStart ? new Date(firma.datumOdmoraStart) : null;
      const krajOdmora = firma.datumOdmoraEnd ? new Date(firma.datumOdmoraEnd) : null;

      if (pocetakOdmora && krajOdmora && today >= pocetakOdmora && today <= krajOdmora) {
        alert('Firma je na odmoru. Zakazivanje nije moguće.');
        return;
      }

      this.service.zakaziOdrzavanje(posao).subscribe(response => {
        if (response.success) {
          this.ngOnInit();
        } else {
          alert('Greška prilikom zakazivanja servisa.');
        }
      }, (error: any) => {
        console.error('Greška:', error);
        alert('Greška prilikom zakazivanja servisa.');
      });
    }, (error: any) => {
      console.error('Greška prilikom dohvatanja firme:', error);
      alert('Greška prilikom dohvatanja firme.');
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!this.allowedFileTypes.includes(file.type)) {
        this.error = 'Invalid file type. Only JPG and PNG are allowed.';
        return;
      }
      if (file.size > this.maxFileSize) {
        this.error = 'File size exceeds the maximum limit of 5 MB.';
        return;
      }

      const reader = new FileReader();

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
          this.error = 'Image dimensions must be between 100x100px and 300x300px.';
          this.uploadedImageUrl = reader.result;
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

  logout() {
    localStorage.removeItem('ulogovan');
    this.router.navigate(['']);
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



  azuriraj() {

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
        this.userData.korisnickoIme,
        this.userData.lozinka,
        this.ime || this.userData.ime,
        this.prezime || this.userData.prezime,
        this.userData.tip,
        this.email || this.userData.email,
        this.telefon || this.userData.brojTelefona,
        this.adresa || this.userData.adresa,
        this.userData.pol,
        this.kartica || this.userData.brojKreditneKartice,
        this.uploadedImageUrl || this.userData.profilnaSlika,
        this.userData.blokiran,
        this.userData.firma
      ).subscribe(response => {
        if (response.success) {
          alert('Korisnik je uspešno ažuriran!');
          this.ngOnInit();
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


  firme: Firma[] = [];
  filteredFirme: Firma[] = [];
  decoratorDetails: { [username: string]: User } = {};
  dekorateri: User[] = []

  selectedFirm: Firma | null = null;

  searchNaziv: string = '';
  searchAdresa: string = '';

  sortedBy: string = 'naziv'; // default sorting column
  sortOrder: string = 'asc'; // 'asc' for ascending, 'desc' for descending

  // Method to select a firm and show the "Detaljnije" link
  selectFirm(firma: Firma): void {
    this.selectedFirm = this.selectedFirm === firma ? null : firma;
  }

  // Navigate to the details page and save the firm in localStorage
  goToDetails(firma: Firma): void {
    localStorage.setItem('selectedFirm', JSON.stringify(firma));
    this.router.navigate(['/firma']);
  }


  fetchDekorateriDetails(firma: Firma) {
    firma.dekorateriDetails = []; // Initialize array to hold decorator details
    firma.dekorateri.forEach(username => {
      this.service.getUser(username.toString()).subscribe(dekorater => {
        firma.dekorateriDetails.push(dekorater); // Store decorator details
      });
    });
  }

  search() {
    this.filteredFirme = this.firme.filter(firma => {
      const matchesNaziv = this.searchNaziv ? firma.naziv.toLowerCase().includes(this.searchNaziv.toLowerCase()) : true;
      const matchesAdresa = this.searchAdresa ? firma.adresa.toLowerCase().includes(this.searchAdresa.toLowerCase()) : true;
      return matchesNaziv && matchesAdresa;
    });
  }

  // Sort firms by column
  sortBy(column: string) {
    if (this.sortedBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'; // toggle sorting order
    } else {
      this.sortedBy = column;
      this.sortOrder = 'asc'; // default to ascending on new column
    }

    this.filteredFirme.sort((a, b) => {
      const valueA = a[column as keyof Firma];
      const valueB = b[column as keyof Firma];

      if (this.sortOrder === 'asc') {
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }


}
