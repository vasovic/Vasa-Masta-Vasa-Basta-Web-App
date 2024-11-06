import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import Firma from '../models/firma';
import User from '../models/user';
import { Router } from '@angular/router';
import Zakazivanje from '../models/zakazivanje';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent {


  totalDecoratedGardens: number = 0;
  totalRegisteredOwners: number = 0;
  totalRegisteredDecorators: number = 0;
  jobsInLast24Hours: number = 0;
  jobsInLast7Days: number = 0;
  jobsInLast30Days: number = 0;

  firme: Firma[] = [];
  filteredFirme: Firma[] = [];
  decoratorDetails: { [username: string]: User } = {};
  dekorateri: User[] = []

  searchNaziv: string = '';
  searchAdresa: string = '';

  sortedBy: string = 'naziv'; // default sorting column
  sortOrder: string = 'asc'; // 'asc' for ascending, 'desc' for descending


  constructor(private service: UserService, private router: Router) {}

  ngOnInit(): void {
    this.service.dohvatiFirme().subscribe((data: Firma[]) => {
      this.firme = data;
      this.filteredFirme = data;

      this.firme.forEach(firma => {
        this.fetchDekorateriDetails(firma);
      });
    });
    this.service.dohvatiDekoratere2().subscribe(
      (data: any) => {
        this.totalRegisteredDecorators = data.length;
      }
    );
    this.service.dohvatiVlasnike().subscribe(
      (data: any) => {
        this.totalRegisteredOwners = data.length;
      }
    );
    this.service.dohvatiZavrseno().subscribe(
      (data: any) => {
        this.totalDecoratedGardens = data.length;
      }
    );
    this.service.dohvatiZakazivanja().subscribe(
      (data: Zakazivanje[]) => {
        this.jobsInLast24Hours = data.filter((job: Zakazivanje) => {
          const date = job.datumZakazivanja ? new Date(job.datumZakazivanja) : new Date();
          const now = new Date();
          return (now.getTime() - date.getTime()) < 24 * 60 * 60 * 1000;
        }).length;
        this.jobsInLast7Days = data.filter((job: Zakazivanje) => {
          const date = job.datumZakazivanja ? new Date(job.datumZakazivanja) : new Date();
          const now = new Date();
          return (now.getTime() - date.getTime()) < 7 * 24 * 60 * 60 * 1000;
        }).length;
        this.jobsInLast30Days = data.filter((job: Zakazivanje) => {
          const date = job.datumZakazivanja ? new Date(job.datumZakazivanja) : new Date();
          const now = new Date();
          return (now.getTime() - date.getTime()) < 30 * 24 * 60 * 60 * 1000;
        }).length;
      }
    );


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
