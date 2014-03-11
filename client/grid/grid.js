Template.grid.helpers({
  rows: function () {
          return new Map().grid.grid;
          //return Session.get("Map").grid;
        }
});

Template.grid.rendered = function(){
  console.log('Grid rendered');
}
