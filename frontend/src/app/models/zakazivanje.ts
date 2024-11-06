
import Usluga from "./usluga";

export default class Zakazivanje {
  datumZakazivanja: Date | null = null;
  datumPocetka: Date | null = null;
  datumZavrsetka: Date | null = null;
  nazivFirme: string = "";
  usluge: Array<Usluga> = [];
  kvadratura: number = 0;
  tipBaste: string = "";
  bazenK: number = 0;
  zeleniloK: number = 0;
  namestajK: number = 0;
  fontanaK: number = 0;
  stolovi: number = 0;
  stolice: number = 0;
  dodatniZahtevi: string = "";
  status: number = 0;
  komentar: string = "";
  vlasnik: string = "";
  dekorater: string = "";
  bastaDizajn: Object | null = null;
  poslednjeOdrzavanje: Date | null = null;
  odrzavanje: number = 0
}
