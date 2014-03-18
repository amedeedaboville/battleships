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
    selectableShip: function(){
        var currentGame = gameCollection.find().fetch()[0];
        var player = (Meteor.userId == currentGame.opponent)? 'opponent': 'challenger'; 
        return (Session.get('selectedShip').owner == player);

    }
});

Template.contextMenu.events({
    'click .actionButton' : function(evt) {
        var action = evt.target.id;
        if (action == 'moveShip'){

            console.log(canvas.getShip(Session.get('selectedShip').id).position);

            canvas.moveShip(Session.get('selectedShip'));
            var m = (gameCollection.find().fetch()[0]).map;
            m.__proto__ = new Map();

            console.log(canvas.getShip(Session.get('selectedShip').id).position);

            canvas.setVisibleFromName(m);
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
