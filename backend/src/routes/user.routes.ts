import express from 'express';
import { UserController } from '../controllers/user.controller';
const userRouter = express.Router();

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
)

userRouter.route("/register").post(
    (req,res)=>new UserController().register(req,res)
)

userRouter.route("/register2").post(
    (req,res)=>new UserController().register2(req,res)
)

userRouter.route("/promeniLozinku").post(
    (req,res)=>new UserController().promeniLozinku(req,res)
)

userRouter.route("/profile/:username").get(
    (req,res)=>new UserController().getUser(req,res)
)

userRouter.route("/azurirajKorisnika").post(
    (req,res)=>new UserController().azurirajKorisnika(req,res)
)

userRouter.route("/dohvatiKorisnike").get(
    (req,res)=>new UserController().dohvatiKorisnike(req,res)
)

userRouter.route("/dohvatiDekoratere").get(
    (req,res)=>new UserController().dohvatiDekoratere(req,res)
)

userRouter.route("/dohvatiDekoratere2").get(
    (req,res)=>new UserController().dohvatiDekoratere2(req,res)
)

userRouter.route("/dodajFirmu").post(
    (req, res) => new UserController().dodajFirmu(req, res)
)

userRouter.route("/dohvatiVlasnike").get(
    (req,res)=>new UserController().dohvatiVlasnike(req,res)
)

userRouter.route("/dohvatiFirme").get(
    (req,res)=>new UserController().dohvatiFirme(req,res)
)

userRouter.route("/dohvati/:firma").get(
    (req,res)=>new UserController().getFirma(req,res)
)

userRouter.route("/dodajZakazivanje").post(
    (req, res) => new UserController().dodajZakazivanje(req, res)
)

userRouter.route("/dohvatiZakazivanjaA").post(
    (req,res)=>new UserController().dohvatiZakazivanjaA(req,res)
)

userRouter.route("/dohvatiZakazivanjaNeob").post(
    (req,res)=>new UserController().dohvatiZakazivanjaNeob(req,res)
)

userRouter.route("/potvrdiZakazivanje").post(
    (req,res)=>new UserController().potvrdiZakazivanje(req,res)
)

userRouter.route("/odbijZakazivanje").post(
    (req,res)=>new UserController().odbijZakazivanje(req,res)
)

userRouter.route("/dohvatiMojaZakazivanja").post(
    (req,res)=>new UserController().dohvatiMojaZakazivanja(req,res)
)

userRouter.route("/dohvatiMojaZakazivanjaSve").post(
    (req,res)=>new UserController().dohvatiMojaZakazivanjaSve(req,res)
)

userRouter.route("/zavrsiPosao").post(
    (req,res)=>new UserController().zavrsiPosao(req,res)
)

userRouter.route("/dohvatiZavrseneBaste").post(
    (req,res)=>new UserController().dohvatiZavrseneBaste(req,res)
)

userRouter.route("/zakaziOdrzavanje").post(
    (req,res)=>new UserController().zakaziOdrzavanje(req,res)
)

userRouter.route("/dohvatiZahteveZaOdrzavanje").post(
    (req, res) => new UserController().dohvatiZahteveZaOdrzavanje(req, res)
)

userRouter.route("/odbijOdrzavanje").post(
    (req,res)=>new UserController().odbijOdrzavanje(req,res)
)

userRouter.route("/potvrdiOdrzavanje").post(
    (req,res)=>new UserController().potvrdiOdrzavanje(req,res)
)


userRouter.route("/getJobsLastTwoYears").get(
    (req,res)=>new UserController().getJobsLastTwoYears(req,res)
)

userRouter.route("/dohvatiZavrseno").get(
    (req,res)=>new UserController().dohvatiZavrseno(req,res)
)

userRouter.route("/dohvatiZakazivanja").get(
    (req,res)=>new UserController().dohvatiZakazivanja(req,res)
)

userRouter.route("/otkaziZakazivanje").post(
    (req,res)=>new UserController().otkaziZakazivanje(req,res)
)


/*userRouter.route('/getUser').post(
    (req, res) => new UserController().getUser(req, res)
)
userRouter.route('/dodaj').post(
    (req, res) => new UserController().dodaj(req, res)
)
userRouter.route('/dohvatiOstale').post(
    (req, res) => new UserController().dohvatiOstale(req, res)
)

userRouter.route('/kupiProizvod').post(
    (req, res) => new UserController().kupiProizvod(req, res)
)
userRouter.route('/uplati').post(
    (req, res) => new UserController().uplati(req, res)
)*/


export default userRouter;