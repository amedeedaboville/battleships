Template.grid.helpers({
    rows: function () {
        var game = Session.get('currentGame');
        if (game != undefined) {
            console.log('game exits, pulling grid');
            game.map.__proto__ = new Map(); //get instance methods back
            if (Meteor.userId() == Session.get('currentGame').challenger){
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
    console.log('Grid rendered');
    if (Session.get('currentGame') != undefined)
    {
        var m = Session.get('currentGame').map;
        m.__proto__ = new Map();
        var visibleSquares;

        if (Meteor.userId() == Session.get('currentGame').challenger){
            visibleSquares = m.getVisibleSquares('challenger');
        }

        if (Meteor.userId() == Session.get('currentGame').opponent){
            visibleSquares = m.getVisibleSquares('opponent');
        }

        keys = Object.keys(visibleSquares);
        for (var i=0; i < keys.length; i++){
            keyvar = JSON.parse(keys[i]);
            var squareVisible = m.grid.squares[keyvar[0]][keyvar[1]];
            squareVisible = new Square();
            squareVisible
                squareVisible.visibility = "id=visible";
        }
    }
}

Template.grid.events({
    'click .square' : function(evt) {
        var action = Session.get('selectedAction');
        if(action != undefined && action !== "") {
            var position = JSON.parse($(evt.target).attr('position'))
    console.log("completing action " + action + " with position " + position);
    Meteor.call(action, Session.get('currentGame')._id, Session.get('selectedShip'), position, function(error,result){if(result)$.UIkit.notify('Cruiser fired a cannonShot at position (' + position[0] + "," + position[1]+')')});
        }
        Session.set('selectedAction', "");
    },
'click .square.ship.challenger' : function (evt) {
    g = Session.get('currentGame');
    if (g.challenger == Meteor.userId()){
        //get shipName from this square and find the ship
        var ship = g.map.shipDictionary[this.shipName];
        Session.set('selectedShip', ship)
    }

    else{
        //handle clicking opponent's ship
        Session.set('selectedShip', undefined);
    }
},

    'click .square.ship.opponent' : function (evt) {
        g = Session.get('currentGame');
        if (g.opponent == Meteor.userId()){
            var ship = g.map.shipDictionary[this.shipName];
            Session.set('selectedShip', ship)
        }


    },

    'click .square.sea' : function (evt){
        Session.set('selectedShip', undefined);
    },

    'click .square.coral' : function (evt){
        Session.set('selectedShip', undefined);
    }

//     'mouseenter .square.ship' : function (evt) {
// }
})

Deps.autorun(function(){
    Session.get('selectedShip');
});
