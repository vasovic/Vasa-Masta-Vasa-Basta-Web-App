"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Usluga = new Schema({
    naziv: {
        type: String
    },
    cena: {
        type: Number
    }
});
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
});
exports.default = mongoose_1.default.model('Zakazivanje', Zakazivanje, 'zakazivanja');
