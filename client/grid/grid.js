Template.grid.helpers({
    rows: function () {
        var game = Session.get('currentGame') || [];
        return game.map.grid.grid;
//return Session.get("Map").grid;
    }
});

Template.grid.rendered = function(){
    console.log('Grid rendered');
}
