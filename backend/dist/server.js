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
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const multer = require("multer");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect("mongodb://127.0.0.1:27017/bazaPIA");
mongoose_1.default.connection.once("open", () => {
    console.log("db connection ok");
});
const imageSchema = new mongoose_1.default.Schema({
    img: { data: Buffer, contentType: String },
});
const Image = mongoose_1.default.model("Image", imageSchema);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express_1.default.urlencoded({ extended: true }));
const router = (0, express_1.Router)();
// Handle file upload
app.post('/upload', upload.single('picture'), (req, res) => {
    var _a, _b;
    const newImage = new Image();
    if (newImage.img) {
        newImage.img.data = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
        newImage.img.contentType = (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype;
    }
    newImage.save()
        .then(() => res.send('Image uploaded successfully!'))
        .catch((err) => res.status(500).send(err));
});
router.use("/user", user_routes_1.default);
app.use("/", router);
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(4000, () => console.log(`Express server running on port 4000`));
