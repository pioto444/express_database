import express from "express";
import * as flashcards from "./models/flashcards.js";
import { addCard, validateCardData, modifyCard } from "./models/flashcards.js";

const port = 8000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/cards", (req, res) => {
  res.render("categories", {
    title: "League of Legends",
    categories: flashcards.getCategorySummaries(),
  });
});

app.get("/cards/:category_id", (req, res) => {
  const categoryId = req.params.category_id;
  const category = flashcards.getCategory(categoryId);

  if (!category) {
    return res.sendStatus(404);
  }

  res.render("category", {
    title: category.name,
    category: category,
    front: "",
    back: "",
  });
});

app.post("/cards/:category_id/new", (req, res) => {
  const categoryId = req.params.category_id;

  const category = flashcards.getCategory(categoryId);
  if (!category) return res.sendStatus(404);

  const card = {
    front: String(req.body.front || '').trim(),
    back: String(req.body.back || '').trim()
  };

  console.log("Dodawanie fiszki:", card);

  const errors = validateCardData(card);
  if (errors.length > 0) {
    return res.render("new_card", {
      errors,
      front: card.front,
      back: card.back,
      title: category.name,
      category
    });
  }

  const success = addCard(category, card);
  if (!success) return res.status(500).send("Nie udało się dodać fiszki");

  res.redirect(`/cards/${categoryId}`);
});

app.post("/cards/:category_id/delete", (req, res) => {
  const categoryId = req.params.category_id;
  const cardId = req.body.id;

  const success = flashcards.deleteCard(cardId);
  if (!success) {
    return res.sendStatus(400);
  }

  res.redirect(`/cards/${categoryId}`);
});

app.post("/cards/:category_id/swap", (req, res) => {
  const categoryId = req.params.category_id;
  const cardId = req.body.id;

const card = {
  front: String(req.body.front || ''),
  back: String(req.body.back || ''),
  id: cardId
};

  const errors = validateCardData(card);
  if (errors.length > 0) {
    return res.sendStatus(400);
  }
 
  modifyCard(card);     
  res.redirect(`/cards/${categoryId}`);
});
 
app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}/`);
});

console.log(flashcards.getCategorySummaries());