function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Template.grid.helpers({
    rows: function () {
        return new Map().grid;
        //return Session.get("Map").grid;
    }
});

Template.grid.rendered = function(){
    console.log('Grid rendered');
}
