Deps.autorun(function (){
    Meteor.subscribe('games', Meteor.userId());
});

Template.contextMenu.helpers({
    currentTurn: function() {
        return Session.get('currentTurn');
    },

    selectedShip: function(){
        return Session.get('selectedShip');
    },
});

Template.contextMenu.events({
    'click .actionButton' : function(evt) {
        var action = evt.target.id;
        console.log('selected action:');
        console.log(action);
        Session.set('selectedAction', action);
    }
});
