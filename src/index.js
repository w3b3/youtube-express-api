import express  from "express";
import session from "express-session";
import cors from "cors";
// import { getAuth, signInWithCustomToken } from "firebase/auth";
// import { getDatabase, ref, set } from "firebase/database";
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { google } from "googleapis";
// import { OAuth2Client } from "google-auth-library";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId:p rocess.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

require("dotenv").config();

const app = express();
const port = process.env.PORT || 80; // or any port you prefer

// CORS configuration
const corsOptions = {
  origin: "https://codein.ca", // Allow only your frontend domain
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    secret: ["primeira-atual", "segunda-velha"],
    resave: false,
    saveUninitialized: true,
  }),
);

app.get("/", (req, res) => {
  res.json({message: "nothing to see here"});
});

app.post("/new", (req, res) => {
  if(req?.body?.email ?? false && req?.body?.password ?? false) {
    // const user = auth.createUserWithEmailAndPassword(req.body.email, req.body.password);
    //
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          return res.status(201).json({message: "user created", user: user});
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          return res.status(400).json({message: "nothing happened", error: error
        });
    //
  }
});

// Additional endpoints like listing subscriptions, unsubscribing, etc.

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
