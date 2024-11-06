import { Component } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';
import { UserService } from '../services/user.service';
import Zakazivanje from '../models/zakazivanje';
import { OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexPlotOptions
} from 'ng-apexcharts';
import { ChangeDetectorRef } from '@angular/core';
import Firma from '../models/firma';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-dekorater',
  templateUrl: './dekorater.component.html',
  styleUrls: ['./dekorater.component.css']
})
export class DekoraterComponent implements OnInit {

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

  neobradjenaZakazivanja: Zakazivanje[] = [];
  mojaZakazivanja: Zakazivanje[] = []
  komentarOdbijanja: string = '';
  zakazivanjeZaOdbijanje: Zakazivanje | null = null;
  zahteviZaOdrzavanje: Zakazivanje[] = []

  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'bar',
      height: 350
    },
    title: {
      text: ''
    },
    xaxis: {
      categories: []
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    dataLabels: {
      enabled: false
    }
  };
  jobCounts: number[] = Array(12).fill(0);
  public pieChartOptions: any = {
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    title: {
      text: ''
    },
    labels: [],
    dataLabels: {
      enabled: false
    }
  };

  public histogramChartOptions: any = {
    series: [],
    chart: {
      type: 'bar',
      height: 350
    },
    title: {
      text: ''
    },
    xaxis: {
      categories: []
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        endingShape: 'flat'
      }
    },
    dataLabels: {
      enabled: false
    }
  };
  public decorators: string[] = [];
  public jobData: { decorator: string, count: number }[] = [];



  constructor(private service: UserService, private router: Router, private cdr: ChangeDetectorRef) {}

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
      if (user.tip !== 'dekorater') {
        this.router.navigate(['']);
        return;
      }
      },
      (error: any) => {
      console.error('Greska pri dohvatanju korisnika.', error);
      this.router.navigate(['']);
      }
    );
    //console.log(this.korisnik)
    if (this.korisnik) {
      this.service.getUser(this.korisnik).subscribe(response => {
      this.userData = response;
      //console.log(this.userData)
      this.service.dohvatiZakazivanjaNeob(this.userData.firma).subscribe(
        (data: Zakazivanje[]) => {
          this.neobradjenaZakazivanja = data.sort((a, b) => {
            const dateA = a.datumZakazivanja ? new Date(a.datumZakazivanja).getTime() : 0;
            const dateB = b.datumZakazivanja ? new Date(b.datumZakazivanja).getTime() : 0;
            return dateB - dateA; // Descending order (most recent first)
          });
        //console.log(this.neobradjenaZakazivanja)
        },
        (error: any) => {
        console.error('Greška pri dohvatanju zakazivanja:', error);
        }
      );

      // Get all zakazivanja that are his
      this.service.dohvatiMojaZakazivanja(this.userData.korisnickoIme).subscribe(
        (data: Zakazivanje[]) => {
        this.mojaZakazivanja = data;
        if(this.mojaZakazivanja.length === 0){
          this.userData.blokiran = 5;
          this.service.azurirajKorisnika(this.userData.korisnickoIme,this.userData.lozinka,this.userData.ime,this.userData.prezime,this.userData.tip,this.userData.email,this.userData.brojTelefona,this.userData.adresa,this.userData.pol,this.userData.brojKreditneKartice,this.userData.profilnaSlika,this.userData.blokiran,this.userData.firma).subscribe(response => {
            if (response.success) {
              //alert('Korisnik je uspešno ažuriran!');
            } else {
              //alert('Ažuriranje neuspešno.');
            }
          }, (error: any) => {
            console.error('Greška:', error);
            alert('Greška prilikom ažuriranja.');
          });
        }
        //console.log(this.mojaZalazivanja)
        },
        (error: any) => {
        console.error('Greška pri dohvatanju mojih zakazivanja:', error);
        }
      );

      this.service.dohvatiZahteveZaOdrzavanje(this.userData.firma).subscribe(
        (data: Zakazivanje[]) => {
          this.zahteviZaOdrzavanje = data;
          //console.log(this.zahteviZaOdrzavanje)
        },
        (error: any) => {
          console.error('Greška pri dohvatanju zahteva za održavanje:', error);
        }
      );

      });

      setTimeout(() => {
            if (this.korisnik) {
              this.getJobCountsByMonth(this.korisnik);
            }
            this.getJobDistributionByDecorator();
            this.getAverageJobsPerDay();


        this.chartOptions = {
          series: [
            {
              name: 'Broj Poslova',
              data: this.jobCounts
            }
          ],
          chart: {
            type: 'bar',
            height: 350
          },
          title: {
            text: ''
          },
          xaxis: {
            categories: [
              'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
              'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'
            ]
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '50%'
            }
          },
          dataLabels: {
            enabled: false
          }
        };
        this.cdr.detectChanges();
      }, 1000);


    }

  }


  getAverageJobsPerDay(): void {
    this.service.getJobsLastTwoYears().subscribe((data: Zakazivanje[]) => {
      const jobCounts = this.calculateAverageJobs(data);
      this.histogramChartOptions = {
        series: [{
          name: 'Broj Poslova',
          data: jobCounts
        }],
        chart: {
          type: 'bar',
          height: 350
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned']
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
            endingShape: 'flat'
          }
        },
        dataLabels: {
          enabled: false
        }
      };
    }, (error: any) => {
      console.error('Error fetching job data:', error);
    });

  }

  calculateAverageJobs(data: Zakazivanje[]): number[] {
    // Assuming `data` contains an array of job entries with a `date` field
    const dayCounts = Array(7).fill(0);
    const dayTotal = Array(7).fill(0);

    data.forEach(job => {
      const date = job.datumPocetka ? new Date(job.datumPocetka) : new Date(); // Adjust if the date is in a different format
      const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      dayCounts[day] += 1; // Increment count for the day
      dayTotal[day] += 1; // For average calculation
    });

    return dayCounts.map(count => count / dayTotal.reduce((a, b) => a + b, 0));
  }

  getJobDistributionByDecorator(): void {
    if (this.korisnik) {
      this.service.getUser(this.korisnik).subscribe(dekorater => {
        const firma = dekorater.firma;

        this.service.getFirma(firma).subscribe(firmData => {
          const jobCounts: { [decorator: string]: number } = {};

          // Create an array of observables for each decorator
          const requests = firmData.dekorateri.map(dekorater => {
            return this.service.dohvatiMojaZakazivanjaSve(dekorater.toString()).pipe(
              map(data => {
                jobCounts[dekorater.toString()] = data.length;
              })
            );
          });

          // Use forkJoin to wait for all requests to complete
          forkJoin(requests).subscribe(() => {
            this.jobData = Object.keys(jobCounts).map(decorator => ({
              decorator,
              count: jobCounts[decorator] || 0 // Ensure we default to 0 if undefined
            }));

            this.pieChartOptions = {
              series: this.jobData.map(d => d.count),
              chart: {
                type: 'pie',
                height: 350
              },
              title: {
                text: ''
              },
              labels: this.jobData.map(d => d.decorator),
              dataLabels: {
                enabled: true
              }
            };
          }, error => {
            console.error('Error fetching job counts:', error);
          });
        }, error => {
          console.error('Error fetching firm data:', error);
        });
      }, error => {
        console.error('Error fetching user data:', error);
      });

    }
  }


  getJobCountsByMonth(username: string): void {
    if (this.korisnik) {
      this.service.dohvatiMojaZakazivanjaSve(this.korisnik) // Adjust the URL as necessary
        .subscribe(data => {
        // Process the data to count jobs by month
        const monthCounts: { [key: number]: number } = {};

        data.forEach(job => {
          const month = job.datumPocetka ? new Date(job.datumPocetka).getMonth() : -1; // Get month (0-11)
          if (monthCounts[month]) {
            monthCounts[month]++;
          } else {
            monthCounts[month] = 1;
          }
        });

        // Fill jobCounts array
        for (let i = 0; i < 12; i++) {
          this.jobCounts[i] = monthCounts[i] || 0; // Default to 0 if no jobs in that month
        }
        console.log(this.jobCounts)
      }, error => {
        console.error('Error fetching job counts:', error);
      });
  }
}

  selectedOdrzavanje:Zakazivanje | null = null;
  procVremeZavrsetka: Date | null = null;

  setSelectedOdrzavanje(odrzavanje: Zakazivanje): void {
    this.selectedOdrzavanje = odrzavanje;
  }


  potvrdiOdrzavanje(): void {
    if (this.selectedOdrzavanje && this.procVremeZavrsetka) {
      // Pozivanje servisa za odbijanje zakazivanja
      this.service.potvrdiOdrzavanje(this.selectedOdrzavanje, this.procVremeZavrsetka).subscribe(
        () => {
          this.ngOnInit()
        },
        (error: any) => {
          console.error('Greška pri potvrdi odrzavanja:', error);
        }
      );
    } else {
      console.error('Datum zavrsetka odrzavanja je obavezan.');
    }
  }


  // Function to handle rejecting a maintenance request
  odbijOdrzavanje(odrzavanje: Zakazivanje): void {
    this.service.odbijOdrzavanje(odrzavanje).subscribe(
      () => {
        this.ngOnInit();
      },
      (error: any) => {
        console.error('Greška pri odbijanju održavanja:', error);
      }
    );

  }

  // Function to determine if a service button should be shown (optional)
  showServisButton(basta: any): boolean {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    return basta.datumZavrsetka <= sixMonthsAgo;
  }

  setSelectedZakazivanje(zakazivanje: Zakazivanje): void {
    this.zakazivanjeZaOdbijanje = zakazivanje;
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

  potvrdiZakazivanje(zakazivanje: Zakazivanje): void {
    // Pozivanje servisa za potvrdu zakazivanja

    this.service.potvrdiZakazivanje(zakazivanje, this.userData.korisnickoIme).subscribe(
      () => {
        this.ngOnInit()
      },
      (error: any) => {
        console.error('Greška pri potvrđivanju zakazivanja:', error);
      }
    );
  }


  odbijZakazivanje(): void {
    if (this.zakazivanjeZaOdbijanje && this.komentarOdbijanja) {
      // Pozivanje servisa za odbijanje zakazivanja
      this.service.odbijZakazivanje(this.zakazivanjeZaOdbijanje, this.komentarOdbijanja).subscribe(
        () => {
          this.ngOnInit()
        },
        (error: any) => {
          console.error('Greška pri odbijanju zakazivanja:', error);
        }
      );
    } else {
      console.error('Komentar za odbijanje je obavezan.');
    }
  }

  zavrsiPosao(zakazivanje: Zakazivanje): void {
    // Pozivanje servisa za završetak posla
    this.service.zavrsiPosao(zakazivanje).subscribe(
      () => {
        this.ngOnInit()
      },
      (error: any) => {
        console.error('Greška pri završavanju posla:', error);
      }
    );
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







}
