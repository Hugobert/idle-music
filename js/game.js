
// GAME INITIALIZATION //

$(document).ready(function(){

  // Load saved game. If nonexitent, use defaults from items.js //
  if(localStorage.getItem("game") != null){
    var game = JSON.parse(Base64.decode(localStorage.getItem("game")));
    console.log("Saved game successfully loaded");
    console.log(game);
  } else {
    var game = newGame;
    console.log("Starting a new game");
    console.log(game);
  }
  updateValues();



  // AUTOMATION //

  setInterval(function(){
    gainAuto();
    updateValues();
  },game.tickspeed);



  // AUTOSAVE //

  setInterval(function(){
    save();
  },15000);


  // GAMEPLAY FUNCTIONS //

  // Transforms a value into a well readable format.
  function readable(decimal,method) {
    if(method=="money"){
      if(new Decimal(decimal).gt(1000)){
        var x = new Decimal(decimal).toExponential(3) + " " + game.money.name;
      } else {
        var x = new Decimal(decimal).toFixed(2) + " " + game.money.name;
      }
    }
    else if (method=="other"){
      if(new Decimal(decimal).gt(1000)){
        var x = new Decimal(decimal).toExponential(3);
      } else {
        var x = new Decimal(decimal).toFixed(2);
      }
    }
    return x;
  }

  // Adds Money based on gainPerSec //
  function gainAuto(){
    // Calculate GainPerSec - I should do something like foreach so things can generate other stuff too //
    game[game.weed.generates].gainPerSec = new Decimal(game.weed.amount).mul(game.weed.power);

    game.creativity.amount = new Decimal(game.creativity.amount).plus(game.creativity.gainPerSec/(1000/game.tickspeed));
    game.money.amount = new Decimal(game.money.amount).plus(game.money.gainPerSec/(1000/game.tickspeed));
    game.weed.amount = new Decimal(game.weed.amount).plus(game.weed.gainPerSec/(1000/game.tickspeed));
  }

  // Subtracts 'amount' from 'target's amount //
  function gameSubtract(target, amount){
    if (new Decimal(target.amount).gte(amount)){
      target.amount = new Decimal(target.amount).sub(amount);
      return true;
    } else return false;
  }

  // Adds 'amount' to 'target's amount //
  function gameAdd(target, amount){
    target.amount = new Decimal(target.amount).add(amount);
  }

  // Buy 'amount' of 'product' and pay accordingly.
  function gameBuy(product, amount){
    if (gameSubtract(game[product.buyCurrency], (product.cost*amount)) ){
      gameAdd(product, amount);
    } else {
      return false;
    }
  }

  // Updates all outputs (e.g. on the sidebar) //
  function updateValues() {
    document.getElementById('moneyAmount').innerHTML = readable(game.money.amount,"money");
    document.getElementById('moneyPerSec').innerHTML = readable(game.money.gainPerSec,"money");
    document.getElementById('creativityAmount').innerHTML = readable(game.creativity.amount,"other");
    document.getElementById('creativityPerSec').innerHTML = readable(game.creativity.gainPerSec,"other");
    document.getElementById('weedAmount').innerHTML = readable(game.weed.amount,"other");
    document.getElementById('weedPerSec').innerHTML = readable(game.weed.gainPerSec,"other");
    document.getElementById('notesAmount').innerHTML = readable(game.notes.amount,"other");
    document.getElementById('notesPerSec').innerHTML = readable(game.notes.gainPerSec,"other");
    document.getElementById('phrasesAmount').innerHTML = readable(game.phrases.amount,"other");
    document.getElementById('phrasesPerSec').innerHTML = readable(game.phrases.gainPerSec,"other");
    document.getElementById('buyWeedCost').innerHTML = readable(game.weed.cost,"money");
    document.getElementById('buyNoteCost').innerHTML = readable(game.notes.cost,"other") + " " + game[game.notes.buyCurrency].name;

    // Convert Notes to Phrases, Phrases to Chains, etc //
    game.phrases.amount = new Decimal(game.notes.amount).div(game[game.notes.isPartOf].cost);

    // Enable and disable buttons if condition is not fulfilled //

    // Buy Weed Button //
    if (new Decimal(game.weed.cost).gt(game[game.weed.buyCurrency].amount)){
      document.getElementById('buyWeedBtn').classList.add("disabled");
    } else {
      document.getElementById('buyWeedBtn').classList.remove("disabled");
    }

    // Buy Note Button //
    if (new Decimal(game.notes.cost).gt(game[game.notes.buyCurrency].amount)){
      document.getElementById('buyNoteBtn').classList.add("disabled");
    } else {
      document.getElementById('buyNoteBtn').classList.remove("disabled");
    }
  }

  // Saves the game to localStorage //
  function save(){
    localStorage.setItem("game",Base64.encode(JSON.stringify(game)));
    console.log("Game saved");
  }

  // Deletes the savegame from localStorage //
  function deleteSave(){
    localStorage.removeItem("game");
    location.reload();
  }



  // EVENT HANDLERS //

  // Beg for Money //
  document.getElementById("clickMoneyBtn").addEventListener("click", function(){
    game.money.amount = new Decimal(game.money.amount).plus(game.money.clickPower);
    updateValues();
  });

  // Buy Weed //
  document.getElementById("buyWeedBtn").addEventListener("click", function(){
    gameBuy(game.weed, 1);
  })

  document.getElementById("buyNoteBtn").addEventListener("click", function(){
    gameBuy(game.notes, 1);
  })

  // Save Button //
  document.getElementById("save").addEventListener("click", function(){
    save();
  });

  // Reset Button //
  document.getElementById("reset").addEventListener("click", function(){
    deleteSave();
  });

});
