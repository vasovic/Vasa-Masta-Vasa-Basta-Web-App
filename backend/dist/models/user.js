"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_WORK_FACTOR = 10;
const Schema = mongoose_1.default.Schema;
let User = new Schema({
    ime: {
        type: String
    },
    prezime: {
        type: String
    },
    korisnickoIme: {
        type: String,
        unique: true
    },
    lozinka: {
        type: String
    },
    tip: {
        type: String
    },
    pol: {
        type: String
    },
    adresa: {
        type: String
    },
    brojTelefona: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    brojKreditneKartice: {
        type: String
    },
    profilnaSlika: {
        type: String
    },
    blokiran: {
        type: Number
    },
    firma: {
        type: String
    }
});
User.pre('save', function (next) {
    const user = this;
    if (!user.isModified('lozinka'))
        return next();
    bcrypt_1.default.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);
        bcrypt_1.default.hash(user.lozinka, salt, function (err, hash) {
            if (err)
                return next(err);
            user.lozinka = hash;
            next();
        });
    });
});
exports.default = mongoose_1.default.model('User', User, 'korisnici');
