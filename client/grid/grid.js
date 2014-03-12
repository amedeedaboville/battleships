Template.grid.helpers({
    rows: function () {
        var game = Session.get('currentGame');
        if (game != undefined){
        return game.map.grid.grid;
        }
    }
});

Template.grid.rendered = function(){
    console.log('Grid rendered');
}
