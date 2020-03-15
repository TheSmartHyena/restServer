const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyparser = require("body-parser");
var uuid = require("uuid");

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const NodeCache = require("node-cache");
const myArticles = new NodeCache();
const myCategories = new NodeCache();

const acceptedLanguage = new Set();
acceptedLanguage.add("fr");
acceptedLanguage.add("de");
acceptedLanguage.add("en");

myCategories.set(uuid.v4(), { libelle: "sf" }, 10000);
myCategories.set(uuid.v4(), { libelle: "policier" }, 10000);

// Check language, if not acceptable send error
app.use(function(req, res, next) {
  if (acceptedLanguage.has(req.headers["accept-language"])) {
    next();
  } else {
    res.status(417).send("Language is not accepted");
  }
});

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

/* Webservice articles */
app
  .route("/article")
  .get(function(req, res) {
    if (req.query.id && myArticles.has(req.query.id)) {
      res.json(myArticles.get(req.query.id));
    } else {
      res.status(204).send("Id does not exist");
    }
  })
  .post(function(req, res) {
    if (
      req.body &&
      req.body.libelle &&
      req.body.prix &&
      req.body.categorie &&
      myCategories.has(req.body.categorie)
    ) {
      myArticles.set(
        uuid.v4(),
        {
          libelle: req.body.libelle,
          prix: req.body.prix,
          categorie: req.body.categorie
        },
        10000
      );
      res.status(201).send("");
    } else {
      res.status(412).send("Error in data sent");
    }
  })
  .delete(function(req, res) {
    if (req.query.id && myArticles.has(req.query.id)) {
      res.json(myArticles.del(req.query.id));
    } else {
      res.status(412).send("Id does not exist");
    }
  });

/* Webservice categorie */
app
  .route("/categorie")
  .get(function(req, res) {
    if (req.query.id && myCategories.has(req.query.id)) {
      res.json(myCategories.get(req.query.id));
    } else {
      res.status(204).send("Id does not exist");
    }
  })
  .post(function(req, res) {
    if (req.body && req.body.libelle) {
      myCategories.set(uuid.v4(), { libelle: req.body.libelle }, 10000);
      res.status(201).send("");
    } else {
      res.status(412).send("Error in data sent");
    }
  })
  .delete(function(req, res) {
    if (req.query.id && myCategories.has(req.query.id)) {
      res.json(myCategories.del(req.query.id));
    } else {
      res.status(412).send("Id does not exist");
    }
  });

/* Webservice articles */
app
  .route("/articles")
  .get(function(req, res) {
    res.json(myArticles.mget(myArticles.keys()));
  })
  .post(function(req, res) {
    res.status(405).send("");
  })
  .patch(function(req, res) {
    res.status(405).send("");
  })
  .put(function(req, res) {
    res.status(405).send("");
  })
  .delete(function(req, res) {
    res.status(405).send("");
  });

/* Webservice categories */
app
  .route("/categories")
  .get(function(req, res) {
    res.json(myCategories.mget(myCategories.keys()));
  })
  .post(function(req, res) {
    res.status(405).send("");
  })
  .patch(function(req, res) {
    res.status(405).send("");
  })
  .put(function(req, res) {
    res.status(405).send("");
  })
  .delete(function(req, res) {
    res.status(405).send("");
  });

// For test purpose
app.get("/200", function(req, res) {
  res.send("Hello World!");
});
