import * as express from 'express';
import User from '../models/user';
import * as bcrypt from 'bcryptjs';
import Firma from '../models/firma'; // Add this line to import the Firma model
import Zakazivanje from '../models/zakazivanje'


export class UserController {

    register = (req: express.Request, res: express.Response) => {
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
        let firma = ""

        //const hashedPassword = bcrypt.hash(lozinka, 10);
        
        let user = new User({
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
        })

        //console.log(user);

        user.save().then((user)=> {
            res.json(0)
        }).catch(err=> {
            res.json(-1)
            console.log(err)
        })

    };

    register2 = (req: express.Request, res: express.Response) => {
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
        let firma = ""

        //const hashedPassword = bcrypt.hash(lozinka, 10);
        
        let user = new User({
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
        })

        //console.log(user);

        user.save().then((user)=> {
            res.json(0)
        }).catch(err=> {
            res.json(-1)
            console.log(err)
        })

    };


    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        User.findOne({ 'korisnickoIme': username }).then(user => {
            if (!user) {
                return res.status(404).json({ success: false, message: 'Korisnik nije pronađen.' });
            } else {
                bcrypt.compare(password, String(user.lozinka), (err, result) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Greška prilikom provere lozinke.' });
                    }

                    if (result) {
                        if (user.blokiran != 1 && user.blokiran != 2) {
                            return res.json({ success: true, user: user });
                        } else {
                            return res.status(403).json({ success: false, message: 'Korisnik je blokiran.' });
                        }
                    } else {
                        return res.status(400).json({ success: false, message: 'Pogrešna lozinka.' });
                    }
                });
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Greška prilikom pronalaženja korisnika.' });
        });
    }

    promeniLozinku = (req: express.Request, res: express.Response) => {
        const { username, oldPassword, newPassword } = req.body;

        User.findOne({ 'korisnickoIme': username }).then(user => {
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
    }

    getUser = (req: express.Request, res: express.Response) => {
        let username = req.params.username;

        User.findOne({ 'korisnickoIme': username }).then(user => {
            if (!user) {
                return res.status(404).json({ success: false, message: 'Korisnik nije pronađen.' });
            }
            res.json(user);
            
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom pronalaženja korisnika.' });
        });
    }

    azurirajKorisnika = (req: express.Request, res: express.Response) => {
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
        let firma = req.body.firma

        User.findOne({ 'korisnickoIme': korisnickoIme }).then(user => {
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
    }

    dohvatiKorisnike = (req: express.Request, res: express.Response) => {
        User.find().then(users => {
            res.json(users);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja korisnika.' });
        });
    }

    obrisiKorisnika = (req: express.Request, res: express.Response) => {
        let username = req.params.username;

        User.deleteOne({ 'korisnickoIme': username }).then(() => {
            res.json({ success: true, message: 'Korisnik je uspešno obrisan.' });
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom brisanja korisnika.' });
        });
    }

    deaktivirajKorisnika = (req: express.Request, res: express.Response) => {
        let username = req.body.korisnickoIme;

        User.updateOne({ 'korisnickoIme': username }, { $set: { 'blokiran': 3 } }).then(() => {
            res.json({ success: true, message: 'Korisnik je uspešno deaktiviran.' });
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom deaktivacije korisnika.' });
        });
    }

    aktivirajKorisnika = (req: express.Request, res: express.Response) => {
        let username = req.body.korisnickoIme;

        User.updateOne({ 'korisnickoIme': username }, { $set: { 'blokiran': 0 } }).then(() => {
            res.json({ success: true, message: 'Korisnik je uspešno aktiviran.' });
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom aktivacije korisnika.' });
        });
    }

    dohvatiDekoratere = (req: express.Request, res: express.Response) => {
        User.find({ 'tip': 'dekorater', 'blokiran': 0 }).then(users => {
            res.json(users);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja dekoratera.' });
        });
    }

    dohvatiDekoratere2 = (req: express.Request, res: express.Response) => {
        User.find({ 'tip': 'dekorater' }).then(users => {
            res.json(users);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja dekoratera.' });
        });
    }

    dohvatiVlasnike = (req: express.Request, res: express.Response) => {
        User.find({ 'tip': 'vlasnik', 'blokiran': 0 }).then(users => {
            res.json(users);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja vlasnika.' });
        });
    }

    dodajFirmu = (req: express.Request, res: express.Response) => {

        let firma1 = req.body.firma;

        let novaFirma = new Firma(firma1);

        novaFirma.save().then(() => {
            res.json({ success: true, message: 'Firma je uspešno dodata.' });
        }).catch(err => {
            console.log(err)
            res.status(500).json({ success: false, message: 'Greška prilikom dodavanja firme.' });
        });
    }

    dohvatiFirme = (req: express.Request, res: express.Response) => {
        Firma.find().then(firme => {
            res.json(firme);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja firmi.' });
        });
    }

    getFirma = (req: express.Request, res: express.Response) => {
        let firma = req.params.firma;

        Firma.findOne({ 'naziv': firma }).then(firma => {
            if (!firma) {
                return res.status(404).json({ success: false, message: 'Firma nije pronađena.' });
            }
            res.json(firma);

        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom pronalaženja firme.' });
        });
    }

    dodajZakazivanje = (req: express.Request, res: express.Response) => {

        let zakazivanje1 = req.body.zakazivanje;

        let novoZakazivanje = new Zakazivanje(zakazivanje1);

        novoZakazivanje.save().then(() => {
            res.json({ success: true, message: 'Zakazivanje je uspešno dodato.' });
        }).catch(err => {
            console.log(err)
            res.status(500).json({ success: false, message: 'Greška prilikom dodavanja zakazivanja.' });
        });
    }

    dohvatiZakazivanjaA = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        Zakazivanje.find({ 'status': { $in: [0, 1] }, 'vlasnik': username }).then(zakazivanja => {
            res.json(zakazivanja);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.' });
        });
    }

    dohvatiZakazivanjaNeob = (req: express.Request, res: express.Response) => {
        let firma = req.body.firma;

        Zakazivanje.find({ 'status': 0, 'nazivFirme': firma }).then(zakazivanja => {
            //console.log(zakazivanja)
            res.json(zakazivanja);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.' });
        });
    }

    potvrdiZakazivanje = (req: express.Request, res: express.Response) => {
        const zakazivanjeData = req.body.zakazivanje;
        const dekoraterUsername = req.body.username;
    
        // Update the status of the zakazivanje (reservation) and set the dekorater field
        Zakazivanje.updateOne({ '_id': zakazivanjeData._id }, { $set: { 'status': 1, 'dekorater': dekoraterUsername } })
            .then(() => {
                // After successful zakazivanje update, update the dekorater's blokiran status
                return User.updateOne({ 'korisnickoIme': dekoraterUsername }, { $set: { 'blokiran': 6 } });
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
    

    odbijZakazivanje = (req: express.Request, res: express.Response) => {
        let zakazivanje1 = req.body.zakazivanje;

        let zakazivanjeP = new Zakazivanje(zakazivanje1);

        let komentar = req.body.komentar;

        zakazivanjeP.status = -1;
        zakazivanjeP.komentar = komentar;

        Zakazivanje.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'status': zakazivanjeP.status, 'komentar': zakazivanjeP.komentar } }).then(() => {
            res.json({ success: true, message: 'Zakazivanje je uspešno otkazano.' });
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom otkazivanja zakazivanja.' });
        });
    }

    dohvatiMojaZakazivanja = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        Zakazivanje.find({ 'dekorater': username, 'status': 1 }).then(zakazivanja => {
            res.json(zakazivanja);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.' });
        });
    }

    dohvatiMojaZakazivanjaSve = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        Zakazivanje.find({ 'dekorater': username, 'status': { $in: [1, 2] } }).then(zakazivanja => {
            res.json(zakazivanja);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.' });
        });
    }

    zavrsiPosao = (req: express.Request, res: express.Response) => {
        let zakazivanje1 = req.body.zakazivanje;

        let zakazivanjeP = new Zakazivanje(zakazivanje1);

        zakazivanjeP.status = 2;
        zakazivanjeP.datumZavrsetka = new Date(); // Set datumZavrsetka to today's date

        Zakazivanje.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'status': zakazivanjeP.status, 'datumZavrsetka': zakazivanjeP.datumZavrsetka } }).then(() => {
            res.json({ success: true, message: 'Posao je uspešno završen.' });
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom završetka posla.' });
        });
    }

    dohvatiZavrseneBaste = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        Zakazivanje.find({ 'status': 2, 'vlasnik': username }).then(zakazivanja => {
            res.json(zakazivanja);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja završenih bašti.' });
        });
    }

    zakaziOdrzavanje = (req: express.Request, res: express.Response) => {
        let zakazivanje1 = req.body.zakazivanje;

        let zakazivanjeP = new Zakazivanje(zakazivanje1);

        zakazivanjeP.odrzavanje = 1;

        Zakazivanje.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'odrzavanje': zakazivanjeP.odrzavanje } })
            .then(() => {
                res.json({ success: true, message: 'Održavanje je uspešno zakazano.' });
            })
            .catch(err => {
                res.status(500).json({ success: false, message: 'Greška prilikom zakazivanja održavanja.' });
            });
    };

    dohvatiZahteveZaOdrzavanje = (req: express.Request, res: express.Response) => {
        let firma = req.body.firma;

        Zakazivanje.find({ 'odrzavanje': 1, 'nazivFirme': firma }).then(zakazivanja => {
            //console.log(zakazivanja)
            res.json(zakazivanja);
        }).catch(err => {
            //console.log(err)
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zahteva za održavanje.' });
        });
    }

    odbijOdrzavanje = (req: express.Request, res: express.Response) => {
        let zakazivanje1 = req.body.zakazivanje;

        let zakazivanjeP = new Zakazivanje(zakazivanje1);

        zakazivanjeP.odrzavanje = 0;

        Zakazivanje.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'odrzavanje': zakazivanjeP.odrzavanje } }).then(() => {
            res.json({ success: true, message: 'Zahtev za održavanje je uspešno odbijen.' });
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom odbijanja zahteva za održavanje.' });
        });
    }

    potvrdiOdrzavanje = (req: express.Request, res: express.Response) => {
        let zakazivanje1 = req.body.zakazivanje;

        let zakazivanjeP = new Zakazivanje(zakazivanje1);

        zakazivanjeP.odrzavanje = 0;
        zakazivanjeP.poslednjeOdrzavanje = req.body.datum;

        Zakazivanje.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'odrzavanje': zakazivanjeP.odrzavanje, 'poslednjeOdrzavanje': zakazivanjeP.poslednjeOdrzavanje } }).then(() => {
            res.json({ success: true, message: 'Održavanje je uspešno potvrđeno.' });
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom potvrđivanja održavanja.' });
        });
    }


    getJobsLastTwoYears = (req: express.Request, res: express.Response) => {
        let twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

        Zakazivanje.find({
            'datumPocetka': { $gte: twoYearsAgo }
        }).then(zakazivanja => {
            res.json(zakazivanja);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja zakazivanja.', error: err.message });
        });
    }

    dohvatiZavrseno = (req: express.Request, res: express.Response) => {

        Zakazivanje.find({ 'status': 2}).then(zakazivanja => {
            res.json(zakazivanja);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja završenih bašti.' });
        });
    }

    dohvatiZakazivanja = (req: express.Request, res: express.Response) => {

        Zakazivanje.find().then(zakazivanja => {
            res.json(zakazivanja);
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom dohvatanja završenih bašti.' });
        });
    }

    otkaziZakazivanje = (req: express.Request, res: express.Response) => {
        let zakazivanje1 = req.body.zakazivanje;

        let zakazivanjeP = new Zakazivanje(zakazivanje1);

        zakazivanjeP.status = -1;

        Zakazivanje.updateOne({ '_id': zakazivanjeP._id }, { $set: { 'status': zakazivanjeP.status } }).then(() => {
            res.json({ success: true, message: 'Zakazivanje je uspešno otkazano.' });
        }).catch(err => {
            res.status(500).json({ success: false, message: 'Greška prilikom otkazivanja zakazivanja.' });
        });
    }

}


