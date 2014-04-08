Template.grid.helpers({
    rows: function () {
        var game = getCurrentGame();
        var map  = getCurrentMap();
        if (map instanceof Map) {
            if (game){
                var player = game.challenger == Meteor.userId()? 'challenger': 'opponent'; 
                return map.getGrid(player); 
            }
            else{
                return map.getGrid('opponent');
            }
        }
    }
});

Template.grid.rendered = function(){
    var currentGame = Session.get('inGame');
    var map = getCurrentMap();
    if (currentGame != undefined && map != undefined) {
        var visibleSquares;

        if (Meteor.userId() == currentGame.challenger){
            visibleSquares = map.getVisibleSquares('challenger');
        }

        if (Meteor.userId() == currentGame.opponent){
            visibleSquares = map.getVisibleSquares('opponent');
        }

        keys = Object.keys(visibleSquares);
        for (var i=0; i < keys.length; i++){
            keyvar = JSON.parse(keys[i]);
            var squareVisible = map.squares[keyvar[0]][keyvar[1]];
            squareVisible = new Square();
            //squareVisible.visibility = "id=visible";
        }
    }
}

Template.grid.events({
    'click .square' : function(evt) {
        var action = Session.get('selectedAction');
        console.log(action);

        if(action != undefined && action != "" && action != "turnShipLeft" && action != "turnShipRight") {
            var position = JSON.parse(evt.target.id);
            console.log("completing action " + action + " with position " + position);
            Meteor.call('completeTurn', action, Session.get('selectedShip'), position);

            //Don't forget to update the ship session variable!

            //delete it
            //Session.set('selectedShip', undefined); 

            //reset it
            // var ship = getCurrentMap().shipDictionary[Session.get('selectedShip').shipName];
            // Session.set('selectedShip', ship); 


        }
        Session.set('selectedAction', "");
    },
    'click .square.ship.challenger' : function (evt) {
        var currentGame = getCurrentGame();
        var currentMap  = getCurrentMap();
        if (currentGame.challenger == Meteor.userId()) { //get shipName from this square and find the ship
            var ship = currentMap.shipDictionary[this.shipName];
            Session.set('selectedShip', ship); 
        }
        else { //handle clicking opponent's ship
            Session.set('selectedShip', undefined);
        }
    },

    'click .square.ship.opponent' : function (evt) {
        var currentGame = getCurrentGame();
        var currentMap  = getCurrentMap();
        if (currentGame.opponent == Meteor.userId()){
            var ship = currentMap.shipDictionary[this.shipName];
            Session.set('selectedShip', ship)
        }

    },

    'click .square.sea' : function (evt) {
        Session.set('selectedShip', undefined); 
    },

    'click .square.coral' : function (evt) {
        Session.set('selectedShip', undefined);
    }
})
