import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Usluga = new Schema({
    naziv: {
        type: String
    },
    cena: {
        type: Number
    }
})


let Zakazivanje = new Schema({
    vlasnik: {
        type: String,
    },
    dekorater: {
        type: String,
    },
    komentar: {
        type: String
    },
    tipBaste: {
        type: String
    },
    nazivFirme: {
        type: String
    },
    dodatniZahtevi: {
        type: String
    },
    datumZakazivanja: {
        type: Date
    },
    datumPocetka: {
        type: Date
    },
    datumZavrsetka: {
        type: Date
    },
    usluge: {
        type: [Usluga]
    },
    kvadratura: {
        type: Number
    },
    bazenK: {
        type: Number
    },
    zeleniloK: {
        type: Number
    },
    namestajK: {
        type: Number
    },
    fontanaK: {
        type: Number
    },
    stolovi: {
        type: Number
    },
    stolice: {
        type: Number
    },
    status: {
        type: Number
    },
    bastaDizajn: {
        type: Object
    },
    poslednjeOdrzavanje: {
        type: Date
    },
    odrzavanje: {
        type: Number
    }
})

export default mongoose.model('Zakazivanje', Zakazivanje, 'zakazivanja');