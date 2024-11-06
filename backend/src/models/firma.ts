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

let Firma = new Schema({
    naziv: {
        type: String,
        unique:true
    },
    adresa: {
        type: String
    },
    lokacija: {
        type: String
    },
    kontakt: {
        type: String
    },
    datumOdmoraStart: {
        type: Date
    },
    datumOdmoraEnd: {
        type: Date
    },
    dekorateri: {
        type: Array<String>
    },
    usluge: {
        type: [Usluga]
    }
})

export default mongoose.model('Firma', Firma, 'firme');