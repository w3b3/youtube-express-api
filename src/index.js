"use strict";

import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import errorhandler from "errorhandler";
import cookieParser from "cookie-parser";
// import { getAuth, signInWithCustomToken } from "firebase/auth";
// import { getDatabase, ref, set } from "firebase/database";
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { google } from "googleapis";
// import { OAuth2Client } from "google-auth-library";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import dotenv from "dotenv";
dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID,
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebase);
const auth = getAuth(firebase);

const app = express();
const port = process.env.PORT || 80; // or any port you prefer

// CORS configuration
const corsOptions = {
  origin: "https://codein.ca", // Allow only your frontend domain
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(errorhandler());
app.use(express.json());
app.use(
  session({
    secret: ["primeira-atual", "segunda-velha"],
    resave: false,
    saveUninitialized: true,
  }),
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ message: "Invalid JSON payload" }); // Bad request
  }
  next();
});

// Use the errorhandler middleware
if (process.env.NODE_ENV === "development") {
  // only use in development
  app.use(errorhandler());
}

app.get("/", (req, res) => {
  res.json({ message: "nothing to see here" });
});

app.get("/new", (req, res) => {
  res.json({ message: "think differently" });
});

app.post("/new", (req, res) => {
//  if((req?.body?.email ?? true) || (req?.body?.password ?? true)) {
//      return res.status(400).json({message: "missing inputs"})
//  }
  //console.info(req.body);
  // const user = auth.createUserWithEmailAndPassword(req.body.email, req.body.password);
  // this causes no harm.
  const { email, password } = req.body;
  const auth = getAuth();
    try {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
        console.info(user);
      return res.status(201).json({ message: "user created", user: user });
      // ...
    })
    .catch((error) => {
      //const errorCode = error.code;
      //const errorMessage = error.message;
      console.error(error.code);
        return res
        .status(400)
        .json({ message: "nothing happened", error: error.code });
      //
    });
  } catch (err) {
        console.error("Catch", err);
  }
});

// Additional endpoints like listing subscriptions, unsubscribing, etc.

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
