globalCostMultiplier = 1;

data = {};

data.tickrate = 50;

data.money = {
  nameSingular: "€",
  namePlural: "€",
  amount: new Decimal(0)
}

data.creativity = {
  nameSingular: "Creativity",
  namePlural: "Creativity",
  amount: new Decimal(0),
  value: 0.1,
  gainPerSec: new Decimal(0)
}

data.notes = {
  nameSingular: "Note",
  namePlural: "Notes",
  amount: new Decimal(0),
  cost: 10,
  costMultiplier: globalCostMultiplier,
  currency: data.creativity
}

data.bars = {
  nameSingular: "Bar",
  namePlural: "Bars",
  amount: new Decimal(0),
  cost: 4,
  costMultiplier: globalCostMultiplier,
  currency: data.notes
}

data.thoughts = {
  nameSingular: "Thought",
  namePlural: "Thoughts",
  amount: new Decimal(0),
  cost: 1,
  costMultiplier: 1.1,
  currency: data.bars,
  outputType: data.creativity,
  outputAmount: 0.1
}

data.weed = {
  nameSingular: "Weed",
  namePlural: "Weed",
  amount: new Decimal(0),
  cost: 8,
  costMultiplier: 1.1,
  currency: data.money,
  outputType: data.creativity,
  outputAmount: 1
}

// Initialize game
$(document).ready(function(){
  // If savegame exists...
  if(localStorage.getItem("data") != null){
    // load it into the data object
    data = JSON.parse(localStorage.getItem("data"));
    console.log(data); // to see if it worked
  }
  data.money.amount = new Decimal(data.money.amount);
  data.creativity.amount = new Decimal(data.creativity.amount);
  data.creativity.gainPerSec = new Decimal(data.creativity.gainPerSec);
  data.notes.amount = new Decimal(data.notes.amount);
  data.bars.amount = new Decimal(data.bars.amount);
  data.thoughts.amount = new Decimal(data.thoughts.amount);
  data.weed.amount = new Decimal(data.thoughts.amount);
  // update output
  updateValues();
});

// Button handlers
document.getElementById("save").addEventListener("click", function(){
  save();
})

document.getElementById("addCreativity").addEventListener("click", function(){
  add(data.creativity, 1)
  updateValues();
});

document.getElementById("addNote").addEventListener("click", function(){
  add(data.notes, 1);
  subtract(data.notes.currency, data.notes.cost);
  data.notes.cost = data.notes.cost * data.notes.costMultiplier;
  updateValues();
});

document.getElementById("addBar").addEventListener("click", function(){
  add(data.bars, 1);
  subtract(data.bars.currency, data.bars.cost);
  data.bars.cost = data.bars.cost * data.bars.costMultiplier;
  updateValues();
})

document.getElementById("addThought").addEventListener("click", function(){
  add(data.thoughts, 1);
  subtract(data.thoughts.currency, data.thoughts.cost);
  data.thoughts.cost = data.thoughts.cost * data.thoughts.costMultiplier;
  updateValues();
})

document.getElementById("addWeed").addEventListener("click", function(){
  add(data.weed, 1);
  subtract(data.weed.currency, data.weed.cost);
  data.weed.cost = data.weed.cost * data.weed.costMultiplier;
  updateValues();
})

document.getElementById("sellCreativity").addEventListener("click", function(){
  add(data.money, data.creativity.value);
  subtract(data.creativity, 1);
  updateValues();
})

// Automation
setInterval(function(){
    data.weed.outputType.amount = data.weed.outputType.amount.plus((data.weed.amount * data.weed.outputAmount)/(1000/data.tickrate));
    data.thoughts.outputType.amount = data.thoughts.outputType.amount.plus((data.thoughts.amount * data.thoughts.outputAmount)/(1000/data.tickrate));
    data.creativity.gainPerSec = (data.weed.outputAmount*data.weed.amount) + (data.thoughts.outputAmount*data.thoughts.amount);
    updateValues();
}, data.tickrate);

// Update values
function updateValues(){

  // Table
  document.getElementById("moneyAmount").innerHTML = data.money.amount.toFixed(2) + " " + data.money.namePlural;
  document.getElementById("creativityAmount").innerHTML = data.creativity.amount.toFixed(2) + " (" + data.creativity.gainPerSec.toFixed(2) + "/s)";
  document.getElementById("notesAmount").innerHTML = data.notes.amount.toFixed(2);
  document.getElementById("barsAmount").innerHTML = data.bars.amount.toFixed(2);
  document.getElementById("thoughtAmount").innerHTML = data.thoughts.amount.toFixed(0);
  document.getElementById("weedAmount").innerHTML = data.weed.amount.toFixed(0);

  // Button costs
  document.getElementById("noteCost").innerHTML = data.notes.cost.toFixed(2) + " " + data.notes.currency.namePlural;
  document.getElementById("barCost").innerHTML = data.bars.cost.toFixed(2) + " " + data.bars.currency.namePlural;
  document.getElementById("thoughtCost").innerHTML = data.thoughts.cost.toFixed(2) + " " + data.thoughts.currency.namePlural;
  document.getElementById("weedCost").innerHTML = data.weed.cost.toFixed(2) + " " + data.weed.currency.namePlural;

  // Button availability
  if(data.notes.currency.amount >= data.notes.cost){
    document.getElementById("addNote").disabled = false;
  } else {
    document.getElementById("addNote").disabled = true;
  }

  if(data.bars.currency.amount >= data.bars.cost){
    document.getElementById("addBar").disabled = false;
  } else {
    document.getElementById("addBar").disabled = true;
  }

  if(data.thoughts.currency.amount >= data.thoughts.cost){
    document.getElementById("addThought").disabled = false;
  } else {
    document.getElementById("addThought").disabled = true;
  }

  if(data.weed.currency.amount >= data.weed.cost){
    document.getElementById("addWeed").disabled = false;
  } else {
    document.getElementById("addWeed").disabled = true;
  }

  if(data.creativity.amount >= 1){
    document.getElementById("sellCreativity").disabled = false;
  } else {
    document.getElementById("sellCreativity").disabled = true;
  }
}

function add(target, count){
  //target.amount = target.amount + count;
  target.amount = target.amount.plus(count);
}

function subtract(target, count){
  //target.amount = target.amount - count;
  target.amount = target.amount.minus(count);
}

function save(){
  localStorage.setItem("data",JSON.stringify(data));
}
