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
    'click .square.ship' : function (evt) {
        console.log('square was clicked');
        //get the position of the square and parse it
        var posString = $(evt.target).attr('position');
        var position = JSON.parse(posString);

        //in the grid we need to get the object at the position we located
        var grid = Session.get('currentGame').map.grid;
        grid.__proto__ = new Grid();
        var square = grid.getObjectAtPosition(position);

        //get shipName from this square and find the ship
        var ship = Session.get('currentGame').map.shipDictionary[square.shipName];
        Session.set('selectedShip', ship)
    },

    'mouseenter .square.ship' : function (evt) {
        console.log('square in focus');
        var posString = $(evt.target).attr('position');
        var position = JSON.parse(posString);
        console.log(position[0] + " and " + position[1]);
    }

})
