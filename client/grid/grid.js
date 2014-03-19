Template.grid.helpers({
    rows: function () {
        var game = Session.get('inGame');
        if (game != undefined) {
            console.log('game exits, pulling grid');
            game.map.__proto__ = new Map(); //get instance methods back
            if (Meteor.userId() == game.challenger){
                console.log(game.map.getGrid('challenger'));
                return game.map.getGrid('challenger');
            }
            else {
                console.log(game.map.getGrid('opponent'));
                return game.map.getGrid('opponent'); 
            }
        }
    }
});

Template.grid.rendered = function(){
    var currentGame = Session.get('inGame');
    if (currentGame != undefined)
    {
        var m = currentGame.map;
        m.__proto__ = new Map();
        var visibleSquares;

        if (Meteor.userId() == currentGame.challenger){
            visibleSquares = m.getVisibleSquares('challenger');
        }

        if (Meteor.userId() == currentGame.opponent){
            visibleSquares = m.getVisibleSquares('opponent');
        }

        keys = Object.keys(visibleSquares);
        for (var i=0; i < keys.length; i++){
            keyvar = JSON.parse(keys[i]);
            var squareVisible = m.grid.squares[keyvar[0]][keyvar[1]];
            squareVisible = new Square();
            squareVisible.visibility = "id=visible";
        }
    }
}

Template.grid.events({
    'click .square' : function(evt) {
        var action = Session.get('selectedAction');
        var currentGame = Session.get('inGame');
        console.log(action);

        if(action != undefined && action !== "") {
            var position = JSON.parse($(evt.target).attr('position'))
    console.log("completing action " + action + " with position " + position);
    Meteor.call(action, currentGame._id, Session.get('selectedShip'), position, function(error,result){if(result)$.UIkit.notify('Cruiser fired a cannonShot at position (' + position[0] + "," + position[1]+')')});
        }
        Session.set('selectedAction', "");
    },
'click .square.ship.challenger' : function (evt) {
    var currentGame = Session.get('inGame');
    if (currentGame.challenger == Meteor.userId()){
        //get shipName from this square and find the ship
        var ship = currentGame.map.shipDictionary[this.shipName];
        Session.set('selectedShip', ship); 
    }

    else{
        //handle clicking opponent's ship
        Session.set('selectedShip', undefined);
    }
},

    'click .square.ship.opponent' : function (evt) {
        var currentGame = Session.get('inGame');
        if (currentGame.opponent == Meteor.userId()){
            var ship = currentGame.map.shipDictionary[this.shipName];
            Session.set('selectedShip', ship)
        }


    },

    'click .square.sea' : function (evt){
        Session.set('selectedShip', undefined); 
    },

    'click .square.coral' : function (evt){
        Session.set('selectedShip', undefined);
    }
})
