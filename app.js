import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import passport from "passport";
import Google from "passport-google-oauth20";
import mongoose from "mongoose";
import Routes from "./routes/index.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
dotenv.config();
const GoogleStrategy = Google.Strategy;
mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log("MongoDB server connected.");
  })
  .catch((err) => {
    console.log("Err connecting MongoDB: ", err);
  });

const app = express();
app.set("port", process.env.PORT);
app.use("/public", express.static("public"));

app.use(logger("dev"));
app.use(bodyParser.json({ limit: "100mb", type: "application/json" }));

app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  if ("OPTIONS" === req.method) return res.status(200).send();
  next();
});

app.get("/", (req, res) => {
  res.send("working");
});

//-----------------------------------------------------------------------------------------------------------------------
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENTID,
//     clientSecret: process.env.GOOGLE_CLIENTSECRET,
//     callbackURL: "http://localhost:8000/app/v1/auth/google/callback"
//   },
//   (accessToken, refreshToken, profile, done) =>{
// console.log(accessToken+refreshToken+profile);
// console.log(profile)
// User.findOrCreate({ googleId: profile.id }, function (err, user) {
//   return cb(err, user);
// });
//   }
// ));
//  app.get('/app/v1/auth/google',passport.authenticate('google',{scope: ['profile'] }));
// app.get('/app/v1/auth/google/callback',passport.authenticate('google'))

//---------------------------------------------------------------------------------------------------------------------------

const routes = new Routes(app);

const server = app.listen(8000, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
