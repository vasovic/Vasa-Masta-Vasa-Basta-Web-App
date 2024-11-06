import Usluga from "./usluga";

export default class Firma {
  naziv: string = "";
  adresa: string = "";
  usluge: Array<Usluga> = [];
  dekorateri: Array<String> = [];
  lokacija: string = "";
  kontakt: string = "";
  datumOdmoraStart: Date | null = null;  // Start date of vacation or break
  datumOdmoraEnd: Date | null = null;

  dekorateriDetails: Array<{ ime: string; prezime: string }> = [];
}
