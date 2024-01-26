const express = require("express");
const session = require("express-session");
const { google } = require("googleapis");
const cors = require("cors");

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

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  `${process.env.REDIRECT_URI}/oauth2callback`,
);

const scopes = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

app.get("/auth/google", (req, res) => {
  // const authUrl = oauth2Client.generateAuthUrl({
  //   access_type: "offline",
  //   scope: ["https://www.googleapis.com/auth/youtube"],
  // });
  res.redirect(authUrl);
});

app.get("/oauth2callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    req.session.tokens = tokens;
    res.redirect("/"); // redirect to your front-end app
  } catch (error) {
    console.error("Error on oauth callback", error);
    res.status(500).send("Callback");
  }
});

app.post("/exchange_code", async (req, res) => {
  try {
    // console.log(" req ❎ ", req);
    if (!("body" in req)) {
      res.status(400).send("No body");
      throw new Error('Property "body" is missing in req');
    }
    if (!("code" in req.body)) {
      res.status(400).send("No code");
      throw new Error('Property "code" is missing in req.body');
    }
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // You may want to save these tokens in a session or a database
    // Depending on your application's needs.
      req.session.access_token = tokens.access_token;

    res.send({ token: tokens.access_token });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).send("Token");
  }
});

app.post("/unsubscribe", async (req, res) => {
  try {
    const { id } = req.body;
    console.log("session", req.session);
    let auth;
    if (req.session.tokens) {
      console.info(tokens);
      const { accessToken, refreshToken } = req.session.tokens;
      // Use accessToken and refreshToken as needed
      auth = accessToken;
    } else {
      res.status(401).send("No token found in session");
    }
    //console.log(id, auth); // TODO: DEBUG
    const service = google.youtube("v3");

    service.subscriptions.delete(
      {
        auth,
        id,
      },
      (err) => {
        if (err) {
          console.error(err?.response?.data?.error?.message);
          return res.status(401).send(err?.response?.data?.error?.message);
          //return console.error(err.response?.data.error ?? err.response);
        } else {
          //console.log(`Error: ${err}`);
          console.info("ALL GOOD");
          return res.status(201).send("GOOD");
          // return console.log("ALL GOOD");
        }
      },
    );
  } catch (error) {
    console.error("CATCH", error);
    return res.status(400).send("unsubscribe error");
  }
});

app.get("/", (req, res) => {
  res.send("are you really here?");
});

// Additional endpoints like listing subscriptions, unsubscribing, etc.

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
