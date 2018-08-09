newGame = {
  "tickspeed": 200,
  "money": {
    "name": "€",
    "amount": new Decimal(0),
    "gainPerSec": new Decimal(0),
    "clickPower": new Decimal(1)
  },


  "notes": {
    "name": "Notes",
    "amount": new Decimal(0),
    "gainPerSec": new Decimal(0),
    "cost": 10,
    "buyCurrency": "creativity",
    "isPartOf": "phrases"
  },
  "phrases": {
    "name": "Phrases",
    "amount": new Decimal(0),
    "gainPerSec": new Decimal(0),
    "cost": 16,
    "buyCurrency": "notes",
    "isPartOf": "chains"
  },
  "chains": {
    "name": "Chains",
    "amount": new Decimal(0),
    "gainPerSec": new Decimal(0),
    "cost": 16,
    "buyCurrency": "phrases"
  },

  "weed": {
    "name": "Weed",
    "amount": new Decimal(0),
    "gainPerSec": new Decimal(0),
    "cost": 8,
    "buyCurrency": "money",
    "power": new Decimal(0.1),
    "generates": "creativity"
  },

  "creativity": {
    "name": "Creativity",
    "amount": new Decimal(0),
    "gainPerSec": new Decimal(0),
  }
};
