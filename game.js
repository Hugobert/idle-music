globalCostMultiplier = 1;
tickrate = 50;

money = {
  nameSingular: "€",
  namePlural: "€",
  amount: new Decimal(0),
}

creativity = {
  nameSingular: "Creativity",
  namePlural: "Creativity",
  amount: new Decimal(0),
  value: 0.1,
  gainPerSec: new Decimal(0)
}

notes = {
  nameSingular: "Note",
  namePlural: "Notes",
  amount: new Decimal(0),
  cost: 10,
  costMultiplier: globalCostMultiplier,
  currency: creativity
}

bars = {
  nameSingular: "Bar",
  namePlural: "Bars",
  amount: new Decimal(0),
  cost: 4,
  costMultiplier: globalCostMultiplier,
  currency: notes
}

thoughts = {
  nameSingular: "Thought",
  namePlural: "Thoughts",
  amount: new Decimal(0),
  cost: 1,
  costMultiplier: 1.1,
  currency: bars,
  outputType: creativity,
  outputAmount: 0.1
}

weed = {
  nameSingular: "Weed",
  namePlural: "Weed",
  amount: new Decimal(0),
  cost: 8,
  costMultiplier: 1.1,
  currency: money,
  outputType: creativity,
  outputAmount: 1
}

// Initialize displayed values on load
$(document).ready(function(){
  updateValues();
});

// Button handlers
document.getElementById("addCreativity").addEventListener("click", function(){
  add(creativity, 1)
  updateValues();
});

document.getElementById("addNote").addEventListener("click", function(){
  add(notes, 1);
  subtract(notes.currency, notes.cost);
  notes.cost = notes.cost * notes.costMultiplier;
  updateValues();
});

document.getElementById("addBar").addEventListener("click", function(){
  add(bars, 1);
  subtract(bars.currency, bars.cost);
  bars.cost = bars.cost * bars.costMultiplier;
  updateValues();
})

document.getElementById("addThought").addEventListener("click", function(){
  add(thoughts, 1);
  subtract(thoughts.currency, thoughts.cost);
  thoughts.cost = thoughts.cost * thoughts.costMultiplier;
  updateValues();
})

document.getElementById("addWeed").addEventListener("click", function(){
  add(weed, 1);
  subtract(weed.currency, weed.cost);
  weed.cost = weed.cost * weed.costMultiplier;
  updateValues();
})

document.getElementById("sellCreativity").addEventListener("click", function(){
  add(money, creativity.value);
  subtract(creativity, 1);
  updateValues();
})

// Automation
setInterval(function(){
    weed.outputType.amount = weed.outputType.amount.plus((weed.amount * weed.outputAmount)/(1000/tickrate));
    thoughts.outputType.amount = thoughts.outputType.amount.plus((thoughts.amount * thoughts.outputAmount)/(1000/tickrate));
    creativity.gainPerSec = (weed.outputAmount*weed.amount) + (thoughts.outputAmount*thoughts.amount);
    updateValues();
}, tickrate);

// Update values
function updateValues(){

  // Table
  document.getElementById("moneyAmount").innerHTML = money.amount.toFixed(2) + " " + money.namePlural;
  document.getElementById("creativityAmount").innerHTML = creativity.amount.toFixed(2) + " (" + creativity.gainPerSec.toFixed(2) + "/s)";
  document.getElementById("notesAmount").innerHTML = notes.amount.toFixed(2);
  document.getElementById("barsAmount").innerHTML = bars.amount.toFixed(2);
  document.getElementById("thoughtAmount").innerHTML = thoughts.amount.toFixed(0);
  document.getElementById("weedAmount").innerHTML = weed.amount.toFixed(0);

  // Button costs
  document.getElementById("noteCost").innerHTML = notes.cost.toFixed(2) + " " + notes.currency.namePlural;
  document.getElementById("barCost").innerHTML = bars.cost.toFixed(2) + " " + bars.currency.namePlural;
  document.getElementById("thoughtCost").innerHTML = thoughts.cost.toFixed(2) + " " + thoughts.currency.namePlural;
  document.getElementById("weedCost").innerHTML = weed.cost.toFixed(2) + " " + weed.currency.namePlural;

  // Button availability
  if(notes.currency.amount >= notes.cost){
    document.getElementById("addNote").disabled = false;
  } else {
    document.getElementById("addNote").disabled = true;
  }

  if(bars.currency.amount >= bars.cost){
    document.getElementById("addBar").disabled = false;
  } else {
    document.getElementById("addBar").disabled = true;
  }

  if(thoughts.currency.amount >= thoughts.cost){
    document.getElementById("addThought").disabled = false;
  } else {
    document.getElementById("addThought").disabled = true;
  }

  if(weed.currency.amount >= weed.cost){
    document.getElementById("addWeed").disabled = false;
  } else {
    document.getElementById("addWeed").disabled = true;
  }

  if(creativity.amount >= 1){
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
