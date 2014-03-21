Template.game.helpers({
    complexGame: function(){
        return Session.get('complexGame');
    },

    selectedShip: function(){
        return Session.get('selectedShip');
    },

    selectableShip: function(){
        var player = (Meteor.userId() == Session.get('inGame').opponent)? 'opponent': 'challenger'; 
        return true;//(Session.get('selectedShip').owner == player);
    }
});


Template.contextMenu.helpers({
    currentTurn: function() {
        return Session.get('currentTurn');
    },

    selectedShip: function(){
        return Session.get('selectedShip');
    }

});

Template.contextMenu.events({
    'click .actionButton' : function(evt) {
        var action = evt.target.id;

        if (action == 'moveShip'){

            canvas.moveShip(Session.get('selectedShip'), 2, new THREE.Vector3(1,0,0));
            var m = Session.get('inGame').map;
            m.__proto__ = new Map();
            canvas.setVisibleFromName(m);
        }

        else if (action =='turnShipRight'){
            canvas.rotateShip(Session.get('selectedShip'), new THREE.Vector3(0,1,0), -0.5* Math.PI);
        }

        else if (action =='turnShipLeft'){ 
            canvas.rotateShip(Session.get('selectedShip'), new THREE.Vector3(0,1,0), 0.5* Math.PI);
        }

        console.log('selected action:');
        console.log(action);
        Session.set('selectedAction', action);
    }
});
