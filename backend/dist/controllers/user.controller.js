"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt = __importStar(require("bcryptjs"));
const firma_1 = __importDefault(require("../models/firma")); // Add this line to import the Firma model
const zakazivanje_1 = __importDefault(require("../models/zakazivanje"));
class UserController {
    constructor() {
        this.register = (req, res) => {
            // const errors = validationResult(req);
            // if (!errors.isEmpty()) {
            //     return res.status(400).json({ errors: errors.array() });
            // }
            let ime = req.body.ime;
            let prezime = req.body.prezime;
            let korisnickoIme = req.body.korisnickoIme;
            let lozinka = req.body.lozinka;
            let tip = "vlasnik";
            let pol = req.body.pol;
            let adresa = req.body.adresa;
            let brojTelefona = req.body.brojTelefona;
            let email = req.body.email;
            let brojKreditneKartice = req.body.brojKreditneKartice;
            let profilnaSlika = req.body.profilnaSlika;
            let blokiran = 1;
            let firma = "";
            //const hashedPassword = bcrypt.hash(lozinka, 10);
            let user = new user_1.default({
                ime: ime,
                prezime: prezime,
                korisnickoIme: korisnickoIme,
                lozinka: lozinka,
                tip: tip,
                pol: pol,
                adresa: adresa,
                brojTelefona: brojTelefona,
                email: email,
                brojKreditneKartice: brojKreditneKartice,
                profilnaSlika: profilnaSlika,
                blokiran: blokiran,
                firma: firma
            });
            //console.log(user);
            user.save().then((user) => {
                res.json(0);
            }).catch(err => {
                res.json(-1);
                console.log(err);
            });
        };
        this.register2 = (req, res) => {
            // const errors = validationResult(req);
            // if (!errors.isEmpty()) {
            //     return res.status(400).json({ errors: errors.array() });
            // }
            let ime = req.body.ime;
            let prezime = req.body.prezime;
            let korisnickoIme = req.body.korisnickoIme;
            let lozinka = req.body.lozinka;
            let tip = "dekorater";
            let pol = req.body.pol;
            let adresa = req.body.adresa;
            let brojTelefona = req.body.brojTelefona;
            let email = req.body.email;
            let brojKreditneKartice = req.body.brojKreditneKartice;
            let profilnaSlika = req.body.profilnaSlika;
            let blokiran = 0;
            let firma = "";
            //const hashedPassword = bcrypt.hash(lozinka, 10);
            let user = new user_1.default({
                ime: ime,
                prezime: prezime,
                korisnickoIme: korisnickoIme,
                lozinka: lozinka,
                tip: tip,
                pol: pol,
                adresa: adresa,
                brojTelefona: brojTelefona,
                email: email,
                brojKreditneKartice: brojKreditneKartice,
                profilnaSlika: profilnaSlika,
                blokiran: blokiran,
                firma: firma
            });
            //console.log(user);
            user.save().then((user) => {
                res.json(0);
            }).catch(err => {
                res.json(-1);
                console.log(err);
            });
        };
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default.findOne({ 'korisnickoIme': username }).then(user => {
                if (!user) {
                    return res.status(404).json({ success: false, message: 'Korisnik nije pronađen.' });
                }
                else {
                    bcrypt.compare(password, String(user.lozinka), (err, result) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Greška prilikom provere lozinke.' });
                        }
                        if (result) {
                            if (user.blokiran != 1 && user.blokiran != 2) {
                                return res.json({ success: true, user: user });
                            }
                            else {
                                return res.status(403).json({ success: false, message: 'Korisnik je blokiran.' });
                            }
                        }
                        else {
                            return res.status(400).json({ success: false, message: 'Pogrešna lozinka.' });
                        }
                    });
                }
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Greška prilikom pronalaženja korisnika.' });
            });
        };
        this.promeniLozinku = (req, res) => {
            const { username, oldPassword, newPassword } = req.body;
            user_1.default.findOne({ 'korisnickoIme': username }).then(user => {
                if (!user) {
                    return res.status(404).json({ success: false, message: 'Korisnik nije pronađen.' });
                }
                bcrypt.compare(oldPassword, String(user.lozinka), (err, result) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Greška prilikom provere lozinke.' });
                    }
                    if (!result) {
                        return res.status(400).json({ success: false, message: 'Stara lozinka nije tačna.' });
                    }
                    user.lozinka = newPassword;
                    user.save().then(() => {
                        res.json({ success: true, message: 'Lozinka je uspešno promenjena.' });
                    }).catch(err => {
                        res.status(500).json({ success: false, message: 'Greška prilikom čuvanja nove lozinke.' });
                    });
                });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom pronalaženja korisnika.' });
            });
        };
        this.getUser = (req, res) => {
            let username = req.params.username;
            user_1.default.findOne({ 'korisnickoIme': username }).then(user => {
                if (!user) {
                    return res.status(404).json({ success: false, message: 'Korisnik nije pronađen.' });
                }
                res.json(user);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom pronalaženja korisnika.' });
            });
        };
        this.azurirajKorisnika = (req, res) => {
            let ime = req.body.ime;
            let prezime = req.body.prezime;
            let korisnickoIme = req.body.korisnickoIme;
            let lozinka = req.body.lozinka;
            let tip = req.body.tip;
            let pol = req.body.pol;
            let adresa = req.body.adresa;
            let brojTelefona = req.body.brojTelefona;
            let email = req.body.email;
            let brojKreditneKartice = req.body.brojKreditneKartice;
            let profilnaSlika = req.body.profilnaSlika;
            let blokiran = req.body.blokiran;
            let firma = req.body.firma;
            user_1.default.findOne({ 'korisnickoIme': korisnickoIme }).then(user => {
                if (!user) {
                    return res.status(404).json({ success: false, message: 'Korisnik nije pronađen.' });
                }
                user.lozinka = lozinka;
                user.ime = ime;
                user.prezime = prezime;
                user.email = email;
                user.brojTelefona = brojTelefona;
                user.adresa = adresa;
                user.pol = pol;
                user.brojKreditneKartice = brojKreditneKartice;
                user.profilnaSlika = profilnaSlika;
                user.blokiran = blokiran;
                user.firma = firma;
                user.save().then(() => {
                    res.json({ success: true, message: 'Korisnik je uspešno ažuriran.' });
                }).catch(err => {
                    res.status(500).json({ success: false, message: 'Greška prilikom čuvanja ažuriranja korisnika.' });
                });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom pronalaženja korisnika.' });
            });
        };
        this.dohvatiKorisnike = (req, res) => {
            user_1.default.find().then(users => {
                res.json(users);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja korisnika.' });
            });
        };
        this.obrisiKorisnika = (req, res) => {
            let username = req.params.username;
            user_1.default.deleteOne({ 'korisnickoIme': username }).then(() => {
                res.json({ success: true, message: 'Korisnik je uspešno obrisan.' });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom brisanja korisnika.' });
            });
        };
        this.deaktivirajKorisnika = (req, res) => {
            let username = req.body.korisnickoIme;
            user_1.default.updateOne({ 'korisnickoIme': username }, { $set: { 'blokiran': 3 } }).then(() => {
                res.json({ success: true, message: 'Korisnik je uspešno deaktiviran.' });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom deaktivacije korisnika.' });
            });
        };
        this.aktivirajKorisnika = (req, res) => {
            let username = req.body.korisnickoIme;
            user_1.default.updateOne({ 'korisnickoIme': username }, { $set: { 'blokiran': 0 } }).then(() => {
                res.json({ success: true, message: 'Korisnik je uspešno aktiviran.' });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom aktivacije korisnika.' });
            });
        };
        this.dohvatiDekoratere = (req, res) => {
            user_1.default.find({ 'tip': 'dekorater', 'blokiran': 0 }).then(users => {
                res.json(users);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja dekoratera.' });
            });
        };
        this.dohvatiDekoratere2 = (req, res) => {
            user_1.default.find({ 'tip': 'dekorater' }).then(users => {
                res.json(users);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja dekoratera.' });
            });
        };
        this.dohvatiVlasnike = (req, res) => {
            user_1.default.find({ 'tip': 'vlasnik', 'blokiran': 0 }).then(users => {
                res.json(users);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja vlasnika.' });
            });
        };
        this.dodajFirmu = (req, res) => {
            let firma1 = req.body.firma;
            let novaFirma = new firma_1.default(firma1);
            novaFirma.save().then(() => {
                res.json({ success: true, message: 'Firma je uspešno dodata.' });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ success: false, message: 'Greška prilikom dodavanja firme.' });
            });
        };
        this.dohvatiFirme = (req, res) => {
            firma_1.default.find().then(firme => {
                res.json(firme);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja firmi.' });
            });
        };
        this.getFirma = (req, res) => {
            let firma = req.params.firma;
            firma_1.default.findOne({ 'naziv': firma }).then(firma => {
                if (!firma) {
                    return res.status(404).json({ success: false, message: 'Firma nije pronađena.' });
                }
                res.json(firma);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom pronalaženja firme.' });
            });
        };
        this.dodajZakazivanje = (req, res) => {
            let zakazivanje1 = req.body.zakazivanje;
            let novoZakazivanje = new zakazivanje_1.default(zakazivanje1);
            novoZakazivanje.save().then(() => {
                res.json({ success: true, message: 'Zakazivanje je uspešno dodato.' });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ success: false, message: 'Greška prilikom dodavanja zakazivanja.' });
            });
        };
        this.dohvatiZakazivanjaA = (req, res) => {
            let username = req.body.username;
            zakazivanje_1.default.find({ 'status': { $in: [0, 1] }, 'vlasnik': username }).then(zakazivanja => {
                res.json(zakazivanja);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.' });
            });
        };
        this.dohvatiZakazivanjaNeob = (req, res) => {
            let firma = req.body.firma;
            zakazivanje_1.default.find({ 'status': 0, 'nazivFirme': firma }).then(zakazivanja => {
                //console.log(zakazivanja)
                res.json(zakazivanja);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.' });
            });
        };
        this.potvrdiZakazivanje = (req, res) => {
            const zakazivanjeData = req.body.zakazivanje;
            const dekoraterUsername = req.body.username;
            // Update the status of the zakazivanje (reservation) and set the dekorater field
            zakazivanje_1.default.updateOne({ '_id': zakazivanjeData._id }, { $set: { 'status': 1, 'dekorater': dekoraterUsername } })
                .then(() => {
                // After successful zakazivanje update, update the dekorater's blokiran status
                return user_1.default.updateOne({ 'korisnickoIme': dekoraterUsername }, { $set: { 'blokiran': 6 } });
            })
                .then(() => {
                // If both updates succeed, return a success message
                res.json({ success: true, message: 'Zakazivanje i dekorater su uspešno ažurirani.' });
            })
                .catch(err => {
                // Handle any errors that occur in either of the update operations
                res.status(500).json({ success: false, message: 'Greška prilikom ažuriranja.', error: err.message });
            });
        };
        this.odbijZakazivanje = (req, res) => {
            let zakazivanje1 = req.body.zakazivanje;
            let zakazivanjeP = new zakazivanje_1.default(zakazivanje1);
            let komentar = req.body.komentar;
            zakazivanjeP.status = -1;
            zakazivanjeP.komentar = komentar;
            zakazivanje_1.default.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'status': zakazivanjeP.status, 'komentar': zakazivanjeP.komentar } }).then(() => {
                res.json({ success: true, message: 'Zakazivanje je uspešno otkazano.' });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom otkazivanja zakazivanja.' });
            });
        };
        this.dohvatiMojaZakazivanja = (req, res) => {
            let username = req.body.username;
            zakazivanje_1.default.find({ 'dekorater': username, 'status': 1 }).then(zakazivanja => {
                res.json(zakazivanja);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.' });
            });
        };
        this.dohvatiMojaZakazivanjaSve = (req, res) => {
            let username = req.body.username;
            zakazivanje_1.default.find({ 'dekorater': username, 'status': { $in: [1, 2] } }).then(zakazivanja => {
                res.json(zakazivanja);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.' });
            });
        };
        this.zavrsiPosao = (req, res) => {
            let zakazivanje1 = req.body.zakazivanje;
            let zakazivanjeP = new zakazivanje_1.default(zakazivanje1);
            zakazivanjeP.status = 2;
            zakazivanjeP.datumZavrsetka = new Date(); // Set datumZavrsetka to today's date
            zakazivanje_1.default.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'status': zakazivanjeP.status, 'datumZavrsetka': zakazivanjeP.datumZavrsetka } }).then(() => {
                res.json({ success: true, message: 'Posao je uspešno završen.' });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom završetka posla.' });
            });
        };
        this.dohvatiZavrseneBaste = (req, res) => {
            let username = req.body.username;
            zakazivanje_1.default.find({ 'status': 2, 'vlasnik': username }).then(zakazivanja => {
                res.json(zakazivanja);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja završenih bašti.' });
            });
        };
        this.zakaziOdrzavanje = (req, res) => {
            let zakazivanje1 = req.body.zakazivanje;
            let zakazivanjeP = new zakazivanje_1.default(zakazivanje1);
            zakazivanjeP.odrzavanje = 1;
            zakazivanje_1.default.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'odrzavanje': zakazivanjeP.odrzavanje } })
                .then(() => {
                res.json({ success: true, message: 'Održavanje je uspešno zakazano.' });
            })
                .catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom zakazivanja održavanja.' });
            });
        };
        this.dohvatiZahteveZaOdrzavanje = (req, res) => {
            let firma = req.body.firma;
            zakazivanje_1.default.find({ 'odrzavanje': 1, 'nazivFirme': firma }).then(zakazivanja => {
                //console.log(zakazivanja)
                res.json(zakazivanja);
            }).catch(err => {
                //console.log(err)
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zahteva za održavanje.' });
            });
        };
        this.odbijOdrzavanje = (req, res) => {
            let zakazivanje1 = req.body.zakazivanje;
            let zakazivanjeP = new zakazivanje_1.default(zakazivanje1);
            zakazivanjeP.odrzavanje = 0;
            zakazivanje_1.default.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'odrzavanje': zakazivanjeP.odrzavanje } }).then(() => {
                res.json({ success: true, message: 'Zahtev za održavanje je uspešno odbijen.' });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom odbijanja zahteva za održavanje.' });
            });
        };
        this.potvrdiOdrzavanje = (req, res) => {
            let zakazivanje1 = req.body.zakazivanje;
            let zakazivanjeP = new zakazivanje_1.default(zakazivanje1);
            zakazivanjeP.odrzavanje = 0;
            zakazivanjeP.poslednjeOdrzavanje = req.body.datum;
            zakazivanje_1.default.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'odrzavanje': zakazivanjeP.odrzavanje, 'poslednjeOdrzavanje': zakazivanjeP.poslednjeOdrzavanje } }).then(() => {
                res.json({ success: true, message: 'Održavanje je uspešno potvrđeno.' });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom potvrđivanja održavanja.' });
            });
        };
        this.getJobsLastTwoYears = (req, res) => {
            let twoYearsAgo = new Date();
            twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
            zakazivanje_1.default.find({
                'datumPocetka': { $gte: twoYearsAgo }
            }).then(zakazivanja => {
                res.json(zakazivanja);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.', error: err.message });
            });
        };
        this.dohvatiZavrseno = (req, res) => {
            zakazivanje_1.default.find({ 'status': 2 }).then(zakazivanja => {
                res.json(zakazivanja);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja završenih bašti.' });
            });
        };
        this.dohvatiZakazivanja = (req, res) => {
            zakazivanje_1.default.find().then(zakazivanja => {
                res.json(zakazivanja);
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja završenih bašti.' });
            });
        };
        this.otkaziZakazivanje = (req, res) => {
            let zakazivanje1 = req.body.zakazivanje;
            let zakazivanjeP = new zakazivanje_1.default(zakazivanje1);
            zakazivanjeP.status = -1;
            zakazivanje_1.default.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'status': zakazivanjeP.status } }).then(() => {
                res.json({ success: true, message: 'Zakazivanje je uspešno otkazano.' });
            }).catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom otkazivanja zakazivanja.' });
            });
        };
    }
}
exports.UserController = UserController;
