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
let Firma = new Schema({
    naziv: {
        type: String,
        unique: true
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
        type: (Array)
    },
    usluge: {
        type: [Usluga]
    }
});
exports.default = mongoose_1.default.model('Firma', Firma, 'firme');
