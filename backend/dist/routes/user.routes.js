"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route("/register").post((req, res) => new user_controller_1.UserController().register(req, res));
userRouter.route("/register2").post((req, res) => new user_controller_1.UserController().register2(req, res));
userRouter.route("/promeniLozinku").post((req, res) => new user_controller_1.UserController().promeniLozinku(req, res));
userRouter.route("/profile/:username").get((req, res) => new user_controller_1.UserController().getUser(req, res));
userRouter.route("/azurirajKorisnika").post((req, res) => new user_controller_1.UserController().azurirajKorisnika(req, res));
userRouter.route("/dohvatiKorisnike").get((req, res) => new user_controller_1.UserController().dohvatiKorisnike(req, res));
userRouter.route("/dohvatiDekoratere").get((req, res) => new user_controller_1.UserController().dohvatiDekoratere(req, res));
userRouter.route("/dohvatiDekoratere2").get((req, res) => new user_controller_1.UserController().dohvatiDekoratere2(req, res));
userRouter.route("/dodajFirmu").post((req, res) => new user_controller_1.UserController().dodajFirmu(req, res));
userRouter.route("/dohvatiVlasnike").get((req, res) => new user_controller_1.UserController().dohvatiVlasnike(req, res));
userRouter.route("/dohvatiFirme").get((req, res) => new user_controller_1.UserController().dohvatiFirme(req, res));
userRouter.route("/dohvati/:firma").get((req, res) => new user_controller_1.UserController().getFirma(req, res));
userRouter.route("/dodajZakazivanje").post((req, res) => new user_controller_1.UserController().dodajZakazivanje(req, res));
userRouter.route("/dohvatiZakazivanjaA").post((req, res) => new user_controller_1.UserController().dohvatiZakazivanjaA(req, res));
userRouter.route("/dohvatiZakazivanjaNeob").post((req, res) => new user_controller_1.UserController().dohvatiZakazivanjaNeob(req, res));
userRouter.route("/potvrdiZakazivanje").post((req, res) => new user_controller_1.UserController().potvrdiZakazivanje(req, res));
userRouter.route("/odbijZakazivanje").post((req, res) => new user_controller_1.UserController().odbijZakazivanje(req, res));
userRouter.route("/dohvatiMojaZakazivanja").post((req, res) => new user_controller_1.UserController().dohvatiMojaZakazivanja(req, res));
userRouter.route("/dohvatiMojaZakazivanjaSve").post((req, res) => new user_controller_1.UserController().dohvatiMojaZakazivanjaSve(req, res));
userRouter.route("/zavrsiPosao").post((req, res) => new user_controller_1.UserController().zavrsiPosao(req, res));
userRouter.route("/dohvatiZavrseneBaste").post((req, res) => new user_controller_1.UserController().dohvatiZavrseneBaste(req, res));
userRouter.route("/zakaziOdrzavanje").post((req, res) => new user_controller_1.UserController().zakaziOdrzavanje(req, res));
userRouter.route("/dohvatiZahteveZaOdrzavanje").post((req, res) => new user_controller_1.UserController().dohvatiZahteveZaOdrzavanje(req, res));
userRouter.route("/odbijOdrzavanje").post((req, res) => new user_controller_1.UserController().odbijOdrzavanje(req, res));
userRouter.route("/potvrdiOdrzavanje").post((req, res) => new user_controller_1.UserController().potvrdiOdrzavanje(req, res));
userRouter.route("/getJobsLastTwoYears").get((req, res) => new user_controller_1.UserController().getJobsLastTwoYears(req, res));
userRouter.route("/dohvatiZavrseno").get((req, res) => new user_controller_1.UserController().dohvatiZavrseno(req, res));
userRouter.route("/dohvatiZakazivanja").get((req, res) => new user_controller_1.UserController().dohvatiZakazivanja(req, res));
userRouter.route("/otkaziZakazivanje").post((req, res) => new user_controller_1.UserController().otkaziZakazivanje(req, res));
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
exports.default = userRouter;
