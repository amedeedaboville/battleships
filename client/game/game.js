Deps.autorun(function (){
    Meteor.subscribe('games', Meteor.userId());
});

Template.contextMenu.helpers({
    currentTurn: function() {
        return Session.get('currentTurn');
    },

    selectedShip: function(){
        if (Session.get('selectedShip'))
            return Session.get('selectedShip');
    },
});

Template.contextMenu.events({
    'click .actionButton' : function(evt) {
        var action = evt.target.id;
        if (action == 'moveShip'){
            canvas.moveShip(Session.get('selectedShip'));
        }

        else if (action =='turnShipRight'){
            canvas.rotateShip(Session.get('selectedShip'), new THREE.Vector3(0,1,0), 1.5* Math.PI);
        }

        else if (action =='turnShipLeft'){ 
            canvas.rotateShip(Session.get('selectedShip'), new THREE.Vector3(0,1,0), 0.5* Math.PI);
        }

        console.log('selected action:');
        console.log(action);
        Session.set('selectedAction', action);
    }
});
