import express, { Router } from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.routes";

const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/bazaPIA");
mongoose.connection.once("open", () => {
  console.log("db connection ok");
});

const imageSchema = new mongoose.Schema({
  img: { data: Buffer, contentType: String },
});
const Image = mongoose.model("Image", imageSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));

const router = Router();

// Handle file upload
app.post('/upload', upload.single('picture'), (req: any, res) => {
  const newImage = new Image();
  if (newImage.img) {
    newImage.img.data = req.file?.buffer;
    newImage.img.contentType = req.file?.mimetype;
  }
  newImage.save()
    .then(() => res.send('Image uploaded successfully!'))
    .catch((err) => res.status(500).send(err));
});

router.use("/user", userRouter);
app.use("/", router);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(4000, () => console.log(`Express server running on port 4000`));
