Template.grid.helpers({
    rows: function () {
        var game = Session.get('currentGame');
        if (game != undefined) {
            game.map.__proto__ = new Map(); //get instance methods back
            return game.map.getSquares();
        }
    }
});

Template.grid.rendered = function(){
    console.log('Grid rendered');
}

Template.grid.events({
    'click .square' : function(evt) {
        var action = Session.get('selectedAction');
        if(action != undefined && action !== "") {
            var position = JSON.parse($(evt.target).attr('position'))
            console.log("completing action " + action + " with position " + position);
            Meteor.call(action, currentGame._id, Session.get('selectedShip'), position);
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
