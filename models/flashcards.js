const card_categories = {
  "adc-champions": {
    name: "your bot - champions",
    cards: [
      { front: "smolder", back: "Crit" },
      { front: "jhin", back: "Crit" },
    ],
  },
  "mid-lane-champions": {
    name: "your mid - champions",
    cards: [
      { front: "ahri", back: "Ability Power" },
      { front: "yasuo", back: "Attack Damage" },
    ],
  },
  "top-lane-champions": {
    name: "your top - champions",
    cards: [
      { front: "darius", back: "Lethality" },
      { front: "garen", back: "Ability Power" },
    ],
  },
  "jungle-champions": {
    name: "your jungle - champions",
    cards: [
      { front: "warwick", back: "Attack Damage" },
      { front: "nunu", back: "Full Bomba" },
    ],
  },
  "support-champions": {
    name: "your support - champions",
    cards: [
      { front: "leona", back: "Support" },
      { front: "nami", back: "Support" },
    ],
  },
};

export function getCategorySummaries() {
  return Object.entries(card_categories).map(([id, category]) => {
    return { id, name: category.name };
  });
}

export function hasCategory(categoryId) {
  return card_categories.hasOwnProperty(categoryId);
}

export function getCategory(categoryId) {
  if (hasCategory(categoryId))
    return { id: categoryId, ...card_categories[categoryId] };
  return null;
}

export function addCard(categoryId, card) {
  if (hasCategory(categoryId)) card_categories[categoryId].cards.push(card);
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
  validateCardData,
};