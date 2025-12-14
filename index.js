import express from "express";
import * as flashcards from "./models/flashcards.js";
import * as performances from "./models/performances.js";
import e from "express";

const port = 8000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());

app.get("/cards", (req, res) => {
  res.render("categories", {
    title: "League of Legends",
    categories: flashcards.getCategorySummaries(),
  });
});

app.get("/cards/:category_id", (req, res) => {
  const category = flashcards.getCategory(req.params.category_id);
  if (category != null) {
    res.render("category", {
      title: category.name,
      category,
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/cards/:category_id/new", (req, res) => {
  const category_id = req.params.category_id;
  if (!flashcards.hasCategory(category_id)) {
    res.sendStatus(404);
  } else {
    let card_data = {
      front: req.body.front,
      back: req.body.back,
    };
    var errors = flashcards.validateCardData(card_data);
    if (errors.length == 0) {
      flashcards.addCard(category_id, card_data);
      res.redirect(`/cards/${category_id}`);
    } else {
      res.status(400);
      res.render("new_card", {
        errors,
        title: "Nowa fiszka",
        front: req.body.front,
        back: req.body.back,
        category: {
          id: category_id,
        },
      });
    }
  }
});

app.get("/cs", (req, res) => { 
  const maps = ["Dust2", "Mirage", "Inferno", "Nuke", "Overpass", "Ancient", "Train"];
  res.render("matchesList", {
    title: "Counter-Strike",
    matches: performances.getPerformanceSummaries(),
    maps, name: "", 
  });
});

app.get("/cs/:performanceID", (req, res) => {
  const Performance = performances.getPerformance(req.params.performanceID);
  console.log(Performance);

  if (Performance != null) {
    res.render("performancesList", {
      title: "Counter-Strike",
      Performance,
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/cs/new", (req, res) => { 
  const mapName = req.body.mapName;
  if (!mapName) {
     return res.sendStatus(400);
  }
  else {
    const newMatchId = `match${Object.keys(performances).length + 1}`;

    performances.addMatch(newMatchId, {
    matchName: mapName,
    statistics: [
        { name: "Kills", value: 0 },
        { name: "Deaths", value: 0 },
        { name: "Assists", value: 0 },
    ],
  });
    res.redirect(`/cs/${newMatchId}`);
  }
});

app.post("/cs/:performanceID/new", (req, res) => { 
  console.log("POST /cs/:performanceID/new");
  const performanceID = req.params.performanceID;
  const Performance = performances.getPerformance(req.params.performanceID);
  if (!performances.hasPerformance(performanceID)) {
    return res.sendStatus(404);
  }
  let performance_data = {
    kills: req.body.Kills,
    deaths: req.body.Deaths,
    assists: req.body.Assists,
  };
  console.log(performance_data);
  var errors = performances.validatePerformanceData(performance_data);
  if (errors.length == 0) {
      performances.addPerformance(performanceID,         
        [
            { name: "Kills", value: performance_data.kills },
            { name: "Deaths", value: performance_data.deaths },
            { name: "Assists", value: performance_data.assists },
        ],
      );
      console.log("redirect");
      res.redirect(`/cs/${performanceID}`);
    } else {
      console.log(errors);
      res.render("performancesList", {
      title: "Counter-Strike",
      Performance,
      errors: errors,
      });
    }
});
 
app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}/`);
});

console.log(flashcards.getCategorySummaries());