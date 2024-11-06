import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from '../models/user';
import Firma from '../models/firma';
import Zakazivanje from '../models/zakazivanje';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/user";

  login(username: string, password: string) {
    let data = {
      username: username, password: password
    }
    return this.http.post<any>(`${this.uri}/login`, data)
  }

  register(username: string, password:string, ime: string, prezime:string, email:string, telefon:string, adresa:string, pol:string, kartica:string, slika:String | ArrayBuffer | null) {
    let data = {
      korisnickoIme: username,
      lozinka: password,
      ime: ime,
      prezime: prezime,
      email: email,
      brojTelefona: telefon,
      adresa: adresa,
      pol: pol,
      brojKreditneKartice: kartica,
      profilnaSlika: slika
    }

    console.log(data);

    return this.http.post<Number>(`${this.uri}/register`, data);
  }

  register2(username: string, password:string, ime: string, prezime:string, email:string, telefon:string, adresa:string, pol:string, kartica:string, slika:String | ArrayBuffer | null) {
    let data = {
      korisnickoIme: username,
      lozinka: password,
      ime: ime,
      prezime: prezime,
      email: email,
      brojTelefona: telefon,
      adresa: adresa,
      pol: pol,
      brojKreditneKartice: kartica,
      profilnaSlika: slika
    }

    console.log(data);

    return this.http.post<Number>(`${this.uri}/register2`, data);
  }

  promeniLozinku(username: string, oldPassword: string, newPassword: string) {
    let data = {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    return this.http.post<any>(`${this.uri}/promeniLozinku`, data);
  }

  getUser(username: string) {
    return this.http.get<User>(`${this.uri}/profile/${username}`);
  }

  azurirajKorisnika(username: string,password:string, ime: string, prezime: string, tip:string, email: string, telefon: string, adresa: string, pol: string, kartica: string, slika: String | ArrayBuffer | null, blokiran: Number, firma: string) {
    let data = {
      korisnickoIme: username,
      lozinka: password,
      ime: ime,
      prezime: prezime,
      tip: tip,
      email: email,
      brojTelefona: telefon,
      adresa: adresa,
      pol: pol,
      brojKreditneKartice: kartica,
      profilnaSlika: slika,
      blokiran: blokiran,
      firma: firma
    }

    return this.http.post<any>(`${this.uri}/azurirajKorisnika`, data);
  }

  deaktivirajKorisnika(username: string) {
    return this.http.post<any>(`${this.uri}/deaktivirajKorisnika`, {korisnickoIme: username});
  }

  aktivirajKorisnika(username: string) {
    return this.http.post<any>(`${this.uri}/aktivirajKorisnika`, {korisnickoIme: username});
  }

  dohvatiKorisnike() {
    return this.http.get<User[]>(`${this.uri}/dohvatiKorisnike`);
  }

  dodajFirmu(firma: Firma) {
    let data = {
      firma: firma
    }
    return this.http.post<any>(`${this.uri}/dodajFirmu`, data);
  }

  dohvatiFirme() {
    return this.http.get<Firma[]>(`${this.uri}/dohvatiFirme`);
  }

  dohvatiDekoratere() {
    return this.http.get<User[]>(`${this.uri}/dohvatiDekoratere`);
  }

  dohvatiDekoratere2() {
    return this.http.get<User[]>(`${this.uri}/dohvatiDekoratere2`);
  }

  dohvatiVlasnike() {
    return this.http.get<User[]>(`${this.uri}/dohvatiVlasnike`);
  }

  getFirma(firma: string) {
    return this.http.get<Firma>(`${this.uri}/dohvati/${firma}`);
  }

  dodajZakazivanje(zakazivanje: Zakazivanje) {
    let data = {
      zakazivanje: zakazivanje
    }
    return this.http.post<any>(`${this.uri}/dodajZakazivanje`, data);
  }

  dohvatiZakazivanjaA(username: string) {
    let data = {
      username: username
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/dohvatiZakazivanjaA`, data);
  }

  dohvatiZakazivanjaNeob(firma: string) {
    let data = {
      firma: firma
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/dohvatiZakazivanjaNeob`, data);
  }

  potvrdiZakazivanje(zakazivanje: Zakazivanje, username: string) {
    let data = {
      zakazivanje: zakazivanje,
      username: username
    }
    return this.http.post(`${this.uri}/potvrdiZakazivanje`, data);
  }

  odbijZakazivanje(zakazivanje: Zakazivanje, komentar: string) {
    let data = {
      zakazivanje: zakazivanje,
      komentar: komentar
    }
    return this.http.post(`${this.uri}/odbijZakazivanje`, data);
  }

  dohvatiMojaZakazivanja(username: string) {
    let data = {
      username: username
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/dohvatiMojaZakazivanja`, data);
  }

  dohvatiMojaZakazivanjaSve(username: string) {
    let data = {
      username: username
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/dohvatiMojaZakazivanjaSve`, data);
  }

  zavrsiPosao(zakazivanje: Zakazivanje) {
    let data = {
      zakazivanje: zakazivanje
    }
    return this.http.post<any>(`${this.uri}/zavrsiPosao`, data);
  }

  dohvatiZavrseneBaste(username: string) {
    let data = {
      username: username
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/dohvatiZavrseneBaste`, data);
  }

  dohvatiZavrseno() {
    return this.http.get<Zakazivanje[]>(`${this.uri}/dohvatiZavrseno`);
  }

  zakaziOdrzavanje(zakazivanje: Zakazivanje) {
    let data = {
      zakazivanje: zakazivanje
    }
    return this.http.post<any>(`${this.uri}/zakaziOdrzavanje`, data);
  }

  dohvatiZahteveZaOdrzavanje(firma: string) {
    let data = {
      firma: firma
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/dohvatiZahteveZaOdrzavanje`, data);
  }

  odbijOdrzavanje(zakazivanje: Zakazivanje) {
    let data = {
      zakazivanje: zakazivanje
    }
    return this.http.post<any>(`${this.uri}/odbijOdrzavanje`, data);
  }

  potvrdiOdrzavanje(zakazivanje: Zakazivanje, datum: Date) {
    let data = {
      zakazivanje: zakazivanje,
      datum: datum
    }
    return this.http.post(`${this.uri}/potvrdiOdrzavanje`, data);
  }

  getJobCountByMonth(username: string) {
    let data = {
      username: username
    }
    return this.http.post<number[]>(`${this.uri}/getJobCountByMonth`, data);
  }

  getJobsLastTwoYears() {
    return this.http.get<Zakazivanje[]>(`${this.uri}/getJobsLastTwoYears`);
  }

  dohvatiZakazivanja() {
    return this.http.get<Zakazivanje[]>(`${this.uri}/dohvatiZakazivanja`);
  }

  otkaziZakazivanje(zakazivanje: Zakazivanje) {
    let data = {
      zakazivanje: zakazivanje,
    }
    return this.http.post<any>(`${this.uri}/otkaziZakazivanje`, data);
  }


}
