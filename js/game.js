
// GAME INITIALIZATION //

$(document).ready(function(){

  // Load saved game. If nonexitent, use defaults from items.js //
  if(localStorage.getItem("game") != null){
    var localGame = JSON.parse(Base64.decode(localStorage.getItem("game")));
    if (localGame.version === newGame.version){
      var game = localGame;
      console.log("Saved game successfully loaded");
      console.log(game);
    } else {
      var game = newGame;
      console.log("Local save out of date and incompatible, starting new game.");
    }
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
    // Calculate GainPerSec - I should do something like foreach so things can generate other stuff too, and not //
    // strictly define them, but ADD them //

    game[game.weed.generates].gainPerSec = new Decimal(game.weed.amount).mul(game.weed.power).sub(game.noteGenerators.consumesPerSec*game.noteGenerators.amount);
    game[game.weedPlants.generates].gainPerSec = new Decimal(game.weedPlants.amount).mul(game.weedPlants.power);
    game[game.songs.generates].gainPerSec = new Decimal(game.songs.amount).mul(game.songs.power);

    game.notes.gainPerSec = new Decimal(game.noteGenerators.amount).mul(game.noteGenerators.power);
    game.phrases.gainPerSec = new Decimal(game.notes.gainPerSec).div(game.phrases.cost);
    game.chains.gainPerSec = new Decimal(game.phrases.gainPerSec).div(game.chains.cost);
    game.songs.gainPerSec = new Decimal(game.chains.gainPerSec).div(game.songs.cost);

    game.notes.amount = new Decimal(game.notes.amount).plus(game.notes.gainPerSec/(1000/game.tickspeed))
    game.creativity.amount = new Decimal(game.creativity.amount).plus(game.creativity.gainPerSec/(1000/game.tickspeed));
    game.money.amount = new Decimal(game.money.amount).plus(game.money.gainPerSec/(1000/game.tickspeed));
    game.weed.amount = new Decimal(game.weed.amount).plus(game.weed.gainPerSec/(1000/game.tickspeed));

    if(new Decimal(game.creativity.amount).lte(0)){
      game.creativity.amount = new Decimal(0);
    }
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

  // Buy stuff that actually adds to another item
  function gameBuySpecial(product, amount){
    if (gameSubtract(game[product.buyCurrency], (product.cost*amount)) ){
      gameAdd(game.notes, product.buys);
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
    document.getElementById('chainsAmount').innerHTML = readable(game.chains.amount,"other");
    document.getElementById('chainsPerSec').innerHTML = readable(game.chains.gainPerSec,"other");
    document.getElementById('songsAmount').innerHTML = readable(game.songs.amount,"other");
    document.getElementById('songsPerSec').innerHTML = readable(game.songs.gainPerSec,"other");
    document.getElementById('buyWeedCost').innerHTML = readable(game.weed.cost,"money");
    document.getElementById('buyWeedPlantCost').innerHTML = readable(game.weedPlants.cost,"money");
    document.getElementById('weedPlantsAmount').innerHTML = readable(game.weedPlants.amount,"other");
    document.getElementById('weedPlantsGenerating').innerHTML = readable(game.weedPlants.power*game.weedPlants.amount,"other") + " " + game[game.weedPlants.generates].name + "/s";
    document.getElementById('noteGeneratorsAmount').innerHTML = readable(game.noteGenerators.amount,"other");
    document.getElementById('noteGeneratorsGenerating').innerHTML = readable(game.noteGenerators.power*game.noteGenerators.amount,"other") + " " + game[game.noteGenerators.generates].name + "/s";

    document.getElementById('buyNoteCost').innerHTML = readable(game.notes.cost,"other") + " " + game[game.notes.buyCurrency].name;
    document.getElementById('buyPhraseCost').innerHTML = readable(game.phrases.cost,"other") + " " + game[game.phrases.buyCurrency].name;
    document.getElementById('buyNoteGeneratorCost').innerHTML = readable(game.noteGenerators.consumesPerSec,"other") + " " + game[game.noteGenerators.consumes].name + "/s";

    // Convert Notes to Phrases, Phrases to Chains, etc //
    game[game.notes.isPartOf].amount = new Decimal(game.notes.amount).div(game[game.notes.isPartOf].requiresLower);
    game[game.phrases.isPartOf].amount = new Decimal(game.phrases.amount).div(game[game.phrases.isPartOf].requiresLower);
    game[game.chains.isPartOf].amount = new Decimal(game.chains.amount).div(game[game.chains.isPartOf].requiresLower);


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

    // Buy Phrase Button //
    if (new Decimal(game.phrases.cost).gt(game[game.phrases.buyCurrency].amount)){
      document.getElementById('buyPhraseBtn').classList.add("disabled");
    } else {
      document.getElementById('buyPhraseBtn').classList.remove("disabled");
    }

    // Buy WeedPlant Button //
    if (new Decimal(game.weedPlants.cost).gt(game[game.weedPlants.buyCurrency].amount)){
      document.getElementById('buyWeedPlantBtn').classList.add("disabled");
    } else {
      document.getElementById('buyWeedPlantBtn').classList.remove("disabled");
    }

    if(new Decimal(game.noteGenerators.consumesPerSec).gt(game[game.noteGenerators.consumes].gainPerSec)){
      document.getElementById('buyNoteGeneratorBtn').classList.add("disabled");
    } else {
      document.getElementById('buyNoteGeneratorBtn').classList.remove("disabled");
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
  });

  // Buy Note //
  document.getElementById("buyNoteBtn").addEventListener("click", function(){
    gameBuy(game.notes, 1);
  });

  // Buy Phrase //
  document.getElementById("buyPhraseBtn").addEventListener("click", function(){
    gameBuySpecial(game.phrases, 1);
  })

  // Buy Weedplant //
  document.getElementById("buyWeedPlantBtn").addEventListener("click", function(){
    gameBuy(game.weedPlants, 1);
  });

  // Buy Note Generator //
  document.getElementById("buyNoteGeneratorBtn").addEventListener("click", function(){
    if(new Decimal(game.noteGenerators.consumesPerSec).lte(game[game.noteGenerators.consumes].gainPerSec)){
      gameBuy(game.noteGenerators, 1);
    }
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
