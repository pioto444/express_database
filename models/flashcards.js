import { DatabaseSync } from "node:sqlite";

const db_path = "./db.sqlite";
const db = new DatabaseSync(db_path);

console.log("Creating database tables");
db.exec(
  `CREATE TABLE IF NOT EXISTS fc_categories (
    category_id   INTEGER PRIMARY KEY,
    id            TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL
  ) STRICT;
  CREATE TABLE IF NOT EXISTS fc_cards (
    id            INTEGER PRIMARY KEY,
    category_id   INTEGER NOT NULL REFERENCES fc_categories(category_id) ON DELETE NO ACTION,
    front         TEXT NOT NULL,
    back          TEXT NOT NULL
  ) STRICT;`
);

const db_ops = {
  insert_category: db.prepare(
    `INSERT INTO fc_categories (id, name)
        VALUES (?, ?) RETURNING category_id, id, name;`
  ),
  insert_card: db.prepare(
    `INSERT INTO fc_cards (category_id, front, back) 
        VALUES (?, ?, ?) RETURNING id, front, back;`
  ),
  insert_card_by_id: db.prepare(
    `INSERT INTO fc_cards (category_id, front, back) VALUES (
      (SELECT category_id FROM fc_categories WHERE id = ?),
      ?, 
      ?
    ) 
    RETURNING id, front, back;`
  ),
  get_categories: db.prepare("SELECT id, name, category_id FROM fc_categories;"),
  get_category_by_id: db.prepare(
    "SELECT category_id, id, name FROM fc_categories WHERE id = ?;"
  ),
  get_cards_by_category_id: db.prepare(
    "SELECT id, front, back FROM fc_cards WHERE category_id = ?;"
  ),
  delete_card: db.prepare("DELETE FROM fc_cards WHERE id = ?;"),
};

export function getCategorySummaries() {
  var categories = db_ops.get_categories.all();
  return categories;
}

export function hasCategory(categoryId) {
  let category = db_ops.get_category_by_id.get(categoryId);
  return category != null;
}

export function getCategory(categoryId) {
  let category = db_ops.get_category_by_id.get(categoryId);
  if (category != null) {
    category.cards = db_ops.get_cards_by_category_id.all(category.category_id);
    return category;
  }
  return null;
}

export function addCard(category, card) {
  try {
    console.log("dodawanie karty do tablicy:", { category, ...card });
    const stmt = db.prepare(
      "INSERT INTO fc_cards (category_id, front, back) VALUES (?, ?, ?)"
    );
    stmt.run(category.category_id, card.front, card.back);
    return true;
  } catch (err) {
    console.error("addCard error:", err);
    return false;
  }
}

export function modifyCard( card) {
  try {
    console.log("zamienianie karty do tablicy:", {card });
    const stmt = db.prepare(
      "UPDATE fc_cards SET front = ?, back = ? WHERE id = ?"
    );
    stmt.run(card.front, card.back, card.id);
    return true;
  } catch (err) {
    console.error("addCard error:", err);
    return false;
  }
}

export function deleteCard(cardId) {
  try {
    const info = db_ops.delete_card.run(cardId);
    return info && info.changes > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function validateCardData(card) {
  var errors = [];
  var fields = ["front", "back"];
  for (let field of fields) {
    if (!card.hasOwnProperty(field)) errors.push(`Missing field '${field}'`);
    else {
      if (typeof card[field] != "string")
        errors.push(`'${field}' expected to be string`);
      else {
        if (card[field].length < 1 || card[field].length > 500)
          errors.push(`'${field}' expected length: 1-500`);
      }
    }
  }
  return errors;
}

export default {
  getCategorySummaries,
  hasCategory,
  getCategory,
  addCard,
  modifyCard,
  validateCardData,
  deleteCard,
};