import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import Firma from '../models/firma';
import Zakazivanje from '../models/zakazivanje';
import Usluga from '../models/usluga';
import User from '../models/user';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.css']
})
export class FirmaComponent {

  korisnik: string | null = null;
  firma: Firma | null = null;
  usluge: Usluga[] = [];
  currentStep: number = 1;
  zakazivanje: Zakazivanje = new Zakazivanje();
  error: string = ""
  dostupniRadnici: Boolean = false


  constructor(private service: UserService, private router: Router) {}

  ngOnInit(): void {
    // Get the currently logged in user
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
    // Get the firm details from localStorage
    const firmData = localStorage.getItem('selectedFirm');
    if (firmData) {
      this.firma = JSON.parse(firmData);
      this.usluge = this.firma?.usluge || [];

      for(let dekorater of this.firma?.dekorateri || []){
        this.service.getUser(dekorater.toString()).subscribe(
          data =>{
          if(data.blokiran == 5)
              this.dostupniRadnici = true
          }
      )
      }

    } else {
      // If no firm data is found, redirect back to the firm list
      this.router.navigate(['/vlasnik']);
    }
  }

  goBack(): void {
    this.router.navigate(['/vlasnik']);
  }

  logout() {
    localStorage.removeItem('ulogovan');
    this.router.navigate(['']);
  }

  onUslugaChange(event: any, usluga: any) {
    if (event.target.checked) {
      // Add the selected usluga to the array
      this.zakazivanje.usluge.push(usluga);
    } else {
      // Remove the usluga from the array
      this.zakazivanje.usluge = this.zakazivanje.usluge.filter(item => item.naziv !== usluga.naziv);
    }
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (!this.zakazivanje.datumPocetka || !this.zakazivanje.kvadratura || !this.zakazivanje.tipBaste) {
        alert('Molimo popunite sva obavezna polja.');
        return;
      }
    }
    this.currentStep = 2;
  }

  previousStep() {
    this.currentStep = 1;
  }

  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          this.zakazivanje.bastaDizajn = JSON.parse(result);
          console.log(this.zakazivanje.bastaDizajn)
          const gardenData = JSON.parse(result);
          this.renderGardenDesign(gardenData);
        }
      };
      reader.readAsText(file);
    }

  }

  renderGardenDesign(gardenData: any): void {
    const canvas = <HTMLCanvasElement>document.getElementById('gardenCanvas');
    const ctx = canvas.getContext('2d');

    if (ctx && gardenData) {
      // Clear previous design
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Example: Drawing elements from the JSON
      gardenData.elements.forEach((element: any) => {
        ctx.fillStyle = element.color || 'green'; // Default color
        ctx.fillRect(element.x, element.y, element.width, element.height);
      });
    }
  }

  submitReservation() {

    this.zakazivanje.nazivFirme = this.firma?.naziv || '';
    this.zakazivanje.vlasnik = this.korisnik!;
    this.zakazivanje.datumZakazivanja = new Date();

    const selectedDate = this.zakazivanje.datumPocetka;
    if (!selectedDate) {
      alert('Molimo izaberite datum.');
      return;
    }

    if(this.firma && this.firma.datumOdmoraStart! <= selectedDate && this.firma.datumOdmoraEnd! >= selectedDate){
      alert('Firma ne radi u vreme koje ste izabrali. Molimo izaberite radno vreme.');
      return;
    }

    // Validate total garden area
    if (this.zakazivanje.tipBaste === 'privatna') {
      const totalPrivateArea = (this.zakazivanje.bazenK || 0) + (this.zakazivanje.zeleniloK || 0) + (this.zakazivanje.namestajK || 0);
      if (totalPrivateArea > this.zakazivanje.kvadratura) {
        alert('Kvadrature ne odgovaraju. Ukupna kvadratura bašte mora biti veća od zbira kvadrature bazena, zelenila i nameštaja.');
        return;
      }
    } else if (this.zakazivanje.tipBaste === 'restoran') {
      const totalRestaurantArea = (this.zakazivanje.fontanaK || 0) + (this.zakazivanje.zeleniloK || 0);
      if (totalRestaurantArea > this.zakazivanje.kvadratura) {
        alert('Kvadrature ne odgovaraju. Ukupna kvadratura bašte mora biti veća od zbira kvadrature pod fontanom i zelenilom');
        return;
      }
    }

    // Validate worker availability (this could be a service call)
    if (!this.dostupniRadnici) {
      alert('Nema slobodnih majstora za izabrani datum.');
      return;
    }


    this.service.dodajZakazivanje(this.zakazivanje).subscribe(
      (response: any) => {
      if (response.success) {
        console.log('Reservation data:', this.zakazivanje);
        alert('Uspešno ste zakazali uređenje bašte!');
        this.zakazivanje = new Zakazivanje(); // Reset the form
        this.usluge = [];
        this.ngOnInit(); // Refresh the data
        this.router.navigate(["vlasnik"])
      } else {
        this.error = 'Došlo je do greške prilikom zakazivanja!';
      }
      },
      (error: any) => {
      console.error('Greška prilikom zakazivanja:', error);
      this.error = 'Došlo je do greške prilikom zakazivanja!';
      }
    );

  }


  areWorkersAvailable(firma: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // 1. Fetch the firm details from the database by name
      this.service.getFirma(firma).subscribe(
        (fetchedFirma: Firma) => {
          if (fetchedFirma && fetchedFirma.dekorateri && fetchedFirma.dekorateri.length > 0) {
            const decoratorObservables = fetchedFirma.dekorateri.map(dekoraterUsername =>
              this.service.getUser(dekoraterUsername.toString())
            );

            // 2. Fetch all decorators' details in parallel
            forkJoin(decoratorObservables).subscribe(
              (decorators: User[]) => {
                // 3. Check if any decorator is available (blokiran === 5)
                const isAnyAvailable = decorators.some(dekorater => dekorater.blokiran === 5);

                resolve(isAnyAvailable); // Resolve with true if available, otherwise false
              },
              error => {
                console.error(`Error fetching decorators:`, error);
                reject(error); // Handle errors
              }
            );
          } else {
            resolve(false); // No decorators found, resolve false
          }
        },
        error => {
          console.error(`Error fetching firm ${firma}:`, error);
          reject(error); // Handle errors
        }
      );
    });
  }



}
