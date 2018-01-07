var Monopoly = {};
Monopoly.allowRoll = true;
Monopoly.moneyAtStart = 30;
Monopoly.doubleCounter = 0;
Monopoly.result=[];
Monopoly.playersBroke = [];


Monopoly.init = function(){
    $(document).ready(function(){
        Monopoly.adjustBoardSize();
        $(window).bind("resize",Monopoly.adjustBoardSize);
        Monopoly.initDice();
        Monopoly.initPopups();
        Monopoly.start();        
    });
};

Monopoly.start = function(){
    Monopoly.showPopup("intro")
};


Monopoly.initDice = function(){
    $(".dice").click(function(){
        if (Monopoly.allowRoll){
            Monopoly.rollDice();
        }
    });
    
};

Monopoly.getCurrentPlayer = function(){
    return $(".player.current-turn");
};

Monopoly.getPlayersCell = function(player){
    return player.closest(".cell");
};


Monopoly.getPlayersMoney = function(player){
    return parseInt(player.attr("data-money"));
};

//Monopoly.update

Monopoly.updatePlayersMoney = function(player,amount){ //function to update the current sum of money
    var playersMoney = parseInt(player.attr("data-money"));
    playersMoney -= amount;

    if (playersMoney < 0 ){
        Monopoly.showPopup("broke");
        Monopoly.removePlayer(player);
    }
    else {
        player.attr("data-money",playersMoney);
        $('#score'+player.attr("id")).text("Current money:$ "+player.attr("data-money"));
        player.attr("title",player.attr("id") + ": $" + playersMoney);
        Monopoly.playSound("chaching");
    }
};

Monopoly.removePlayer = function(player){ //function to remove the player who lost
	//var broke = true;
    var idPlayer = player.attr("id");
    Monopoly.playersBroke.push() =  idPlayer;

    var listProperties = $("[data-owner=idPlayer]");

    for (var i = 0; i < listProperties.length; i++) { //removing all his properties
        listProperties[i].addClass("available");
        listProperties[i].removeClass(player.attr("id"));
        listProperties[i].removeAttr("data-index");
    }
    Monopoly.setNextPlayerTurn();
    $('#'+idPlayer).remove();
};

Monopoly.rollDice = function(){ //generating random numbers for dices
   Monopoly.result[0] = Math.floor(Math.random() * 6) + 1 ;
   Monopoly.result[1] = Math.floor(Math.random() * 6) + 1 ;
    $(".dice").find(".dice-dot").css("opacity",0);
    $(".dice#dice1").attr("data-num",Monopoly.result[0]).find(".dice-dot.num" + Monopoly.result[0]).css("opacity",1);
    $(".dice#dice2").attr("data-num",Monopoly.result[1]).find(".dice-dot.num" + Monopoly.result[1]).css("opacity",1);
    if (Monopoly.result[0] == Monopoly.result[1]){
        Monopoly.doubleCounter++;
    }
    var currentPlayer = Monopoly.getCurrentPlayer();
    Monopoly.handleAction(currentPlayer,"move",Monopoly.result[0] + Monopoly.result[1]);
};


Monopoly.movePlayer = function(player,steps){
    Monopoly.allowRoll = false;
    var playerMovementInterval = setInterval(function(){
        if (steps == 0){
            clearInterval(playerMovementInterval);
            Monopoly.handleTurn(player);
        }else{
            var playerCell = Monopoly.getPlayersCell(player);
            var nextCell = Monopoly.getNextCell(playerCell);
            nextCell.find(".content").append(player);
            steps--;
        }
    },200);
};


Monopoly.handleTurn = function(){
    var player = Monopoly.getCurrentPlayer();

    if (player.hasClass("OwnProperty")) {
        player.removeClass("OwnProperty");
    }

    var playerCell = Monopoly.getPlayersCell(player);
    if (playerCell.is(".available.property")){
        Monopoly.handleBuyProperty(player,playerCell);
    }else if(playerCell.is(".property:not(.available)") && !playerCell.hasClass(player.attr("id"))){
         Monopoly.handlePayRent(player,playerCell);
    }else if(playerCell.is(".go-to-jail")){
        Monopoly.handleGoToJail(player);
    }else if(playerCell.is(".chance")){
        Monopoly.handleChanceCard(player);
    }else if(playerCell.is(".community")){
        Monopoly.handleCommunityCard(player);
    }else if(playerCell.attr("data-owner")==player.attr("id")){
        player.addClass("OwnProperty");
        Monopoly.setNextPlayerTurn();
    }
    else{
        Monopoly.setNextPlayerTurn();
    }
}

Monopoly.setNextPlayerTurn = function(){ //define which is the current player
    var currentPlayerTurn = Monopoly.getCurrentPlayer();
    var playerId = parseInt(currentPlayerTurn.attr("id").replace("player",""));
    var nextPlayerId;
    if (Monopoly.result[0]==Monopoly.result[1]) {
        nextPlayerId = playerId;
    }
    else{
        nextPlayerId = playerId + 1;
    }
    for (var i = 0; i < playersBroke.length; i++) {
    	if (nextPlayerId==playersBroke[i]) {
    		nextPlayerId = playerId + 1;
    	}
    }
    if (nextPlayerId > $(".player").length){
        nextPlayerId = 1;
    }
    currentPlayerTurn.removeClass("current-turn");
    var nextPlayer = $(".player#player" + nextPlayerId);
    nextPlayer.addClass("current-turn");

    if (nextPlayer.is(".Jailed")){
        var currentJailTime = parseInt(nextPlayer.attr("data-jail-time"));
        currentJailTime++;
        nextPlayer.attr("data-jail-time",currentJailTime);
        if (currentJailTime > 3){
            nextPlayer.removeClass("Jailed");
            nextPlayer.removeAttr("data-jail-time");
        }
        Monopoly.setNextPlayerTurn();
        return;
    }
    Monopoly.closePopup();
    Monopoly.allowRoll = true;
};


Monopoly.handleBuyProperty = function(player,propertyCell){ //function to buy property
    var propertyCost = Monopoly.calculateProperyCost(propertyCell);
    var popup = Monopoly.getPopup("buy");
    popup.find(".cell-price").text(propertyCost);
    popup.find("button").unbind("click").bind("click",function(){
        var clickedBtn = $(this);
        if (clickedBtn.is("#yes")){
            Monopoly.handleBuy(player,propertyCell,propertyCost);
        }else{
            Monopoly.closeAndNextTurn();
        }
    });
    Monopoly.showPopup("buy");
};

Monopoly.handlePayRent = function(player,propertyCell){ //function to pay rent
    var popup = Monopoly.getPopup("pay");
    var currentRent = parseInt(propertyCell.attr("data-rent"));
    var properyOwnerId = propertyCell.attr("data-owner");
    popup.find("#player-placeholder").text(properyOwnerId);
    popup.find("#amount-placeholder").text(currentRent);
    popup.find("button").unbind("click").bind("click",function(){
        var properyOwner = $(".player#"+ properyOwnerId);
        Monopoly.updatePlayersMoney(player,currentRent);
        Monopoly.updatePlayersMoney(properyOwner,-1*currentRent);
        Monopoly.closeAndNextTurn();
    });
   Monopoly.showPopup("pay");
};


Monopoly.handleGoToJail = function(player){ //function to go to the jail
    var popup = Monopoly.getPopup("jail");
    popup.find("button").unbind("click").bind("click",function(){
        Monopoly.handleAction(player,"jail");
    });
    Monopoly.showPopup("jail");
};


Monopoly.handleChanceCard = function(player){ //function to build the chance cards
    //{"action": "pay", "content": "You just got 10 back from the bank because of a mistake", "amount": -10, "title": "The bank was wrong!"}
    var popup = Monopoly.getPopup("chance");
    popup.find(".popup-content").addClass("loading-state");
    $.get("https://itcmonopoly.appspot.com/get_random_chance_card", function(chanceJson){
        popup.find(".popup-content #text-placeholder").text(chanceJson["content"]);
        popup.find(".popup-title").text(chanceJson["title"]);
        popup.find(".popup-content").removeClass("loading-state");
        popup.find(".popup-content button").attr("data-action",chanceJson["action"]).attr("data-amount",chanceJson["amount"]);
    },"json");
    popup.find("button").unbind("click").bind("click",function(){
        var currentBtn = $(this);
        var action = currentBtn.attr("data-action");
        var amount = currentBtn.attr("data-amount");
        Monopoly.handleAction(player,action,amount);
    });
    Monopoly.showPopup("chance");
};

Monopoly.handleCommunityCard = function(player){ //function to build the community cards
    //{"action": "jail", "content": "Come on pay your taxes! Go to jail", "amount": 30, "title": "Tax evasion"}
    var popup = Monopoly.getPopup("community");
    popup.find(".popup-content").addClass("loading-state");
    $.get("https://itcmonopoly.appspot.com/get_random_community_card", function(communityJson){
        popup.find(".popup-content #text-placeholder").text(communityJson["content"]);
        popup.find(".popup-title").text(communityJson["title"]);
        popup.find(".popup-content").removeClass("loading-state");
        popup.find(".popup-content button").attr("data-action",communityJson["action"]).attr("data-amount",communityJson["amount"]);
    },"json");
    popup.find("button").unbind("click").bind("click",function(){
        var currentBtn = $(this);
        var action = currentBtn.attr("data-action");
        var amount = currentBtn.attr("data-amount");
        Monopoly.handleAction(player,action,amount);
    });
    Monopoly.showPopup("community");
};


Monopoly.sendToJail = function(player){
    player.addClass("Jailed");
    player.attr("data-jail-time",1);
    $(".corner.game.cell.in-jail").append(player);
    Monopoly.playSound("woopwoop");
    Monopoly.setNextPlayerTurn();
    Monopoly.closePopup();
};


Monopoly.getPopup = function(popupId){
    return $(".popup-lightbox .popup-page#" + popupId);
};

Monopoly.calculateProperyCost = function(propertyCell){ //calculating the property for each groups
    var cellGroup = propertyCell.attr("data-group");
    var cellPrice = parseInt(cellGroup.replace("group","")) * 5;
    if (cellGroup == "rail"){
        cellPrice = 10;
    }
    return cellPrice;
};


Monopoly.calculateProperyRent = function(propertyCost){ //calculating the rent
    return propertyCost/2;
};


Monopoly.closeAndNextTurn = function(){
    Monopoly.setNextPlayerTurn();
    Monopoly.closePopup();
};

Monopoly.initPopups = function(){ //beginning of the game 
    $(".popup-page#intro").find("button").click(function(){
        var numOfPlayers = $(this).closest(".popup-page").find("input").val();
        if (Monopoly.isValidInput("numofplayers",numOfPlayers)){
            Monopoly.createPlayers(numOfPlayers);
            Monopoly.createMoneyDisplay(numOfPlayers);
            Monopoly.closePopup();
        }
    });
};


Monopoly.handleBuy = function(player,propertyCell,propertyCost){ //function can buy
    var playersMoney = Monopoly.getPlayersMoney(player)
    if (playersMoney < propertyCost){
        Monopoly.showErrorMsg();
        Monopoly.playSound("woopwoop");
    }else{
        Monopoly.updatePlayersMoney(player,propertyCost);
        var rent = Monopoly.calculateProperyRent(propertyCost);

        propertyCell.removeClass("available")
                    .addClass(player.attr("id"))
                    .attr("data-owner",player.attr("id"))
                    .attr("data-rent",rent);
        Monopoly.setNextPlayerTurn();
    }
};





Monopoly.handleAction = function(player,action,amount){ //using functions for each cases
    switch(action){
        case "move":
            Monopoly.movePlayer(player,amount);
             break;
        case "pay":
            Monopoly.updatePlayersMoney(player,amount);
            Monopoly.setNextPlayerTurn();
            break;
        case "jail":
            Monopoly.sendToJail(player);
            break;
    };
    Monopoly.closePopup();
};





Monopoly.createPlayers = function(numOfPlayers){ //building game : number of players
    var startCell = $(".go");
    for (var i=1; i<= numOfPlayers; i++){
        var player = $("<div />").addClass("player shadowed").attr("id","player" + i).attr("title","player" + i + ": $" + Monopoly.moneyAtStart);
        startCell.find(".content").append(player);
        if (i==1){
            player.addClass("current-turn");
        }
        player.attr("data-money",Monopoly.moneyAtStart);
    }
};

Monopoly.createMoneyDisplay = function(numOfPlayers){ //building game : display the money of each player
    var startCell = $("#scorePlayers");
    for (var i=1; i<= numOfPlayers; i++){
        var player = $("<div />").addClass("score").attr("id","scoreplayer" + i);
        player.append("Curent money:$ "+Monopoly.moneyAtStart);
        startCell.append(player);
    }
};


Monopoly.getNextCell = function(cell){ //moving the player
    var currentCellId = parseInt(cell.attr("id").replace("cell",""));
    var nextCellId = currentCellId + 1;
    if (nextCellId > 40){
        Monopoly.handlePassedGo();
        nextCellId = 1;
    }
    return $(".cell#cell" + nextCellId);
};


Monopoly.handlePassedGo = function(){ //adding money after the go cell
    var player = Monopoly.getCurrentPlayer();
    Monopoly.updatePlayersMoney(player,-(Monopoly.moneyAtStart/10));
};


Monopoly.isValidInput = function(validate,value){ //checking value of users about number of players
    var isValid = false;
    switch(validate){
        case "numofplayers":
            if(value > 1 && value <= 6){
                isValid = true;
            }
    }

    if (!isValid){
        Monopoly.showErrorMsg();
    }
    return isValid;

}

Monopoly.showErrorMsg = function(){
    $(".popup-page .invalid-error").fadeTo(500,1);
    setTimeout(function(){
            $(".popup-page .invalid-error").fadeTo(500,0);
    },2000);
};


Monopoly.adjustBoardSize = function(){
    var gameBoard = $(".board");
    var boardSize = Math.min($(window).height(),$(window).width());
    boardSize -= parseInt(gameBoard.css("margin-top")) *2;
    $(".board").css({"height":boardSize,"width":boardSize});
}

Monopoly.closePopup = function(){
    $(".popup-lightbox").fadeOut();
};

Monopoly.playSound = function(sound){
    var snd = new Audio("./sounds/" + sound + ".wav"); 
    snd.play();
}

Monopoly.showPopup = function(popupId){
    $(".popup-lightbox .popup-page").hide();
    $(".popup-lightbox .popup-page#" + popupId).show();
    $(".popup-lightbox").fadeIn();
};

Monopoly.init();