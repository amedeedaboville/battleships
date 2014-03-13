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
            var position = parsePositions($(evt.target).attr('position'));
            console.log(position[0] + " and " + position[1]);
    },

    'mouseenter .square.ship' : function (evt) {
	    	console.log('square in focus');
            var position = parsePositions($(evt.target).attr('position'));
            console.log(position[0] + " and " + position[1]);
    }

})

parsePositions = function(pos){
            var fin = JSON.parse(pos);
            return fin;

}