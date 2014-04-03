Template.game.helpers({
    complexGame: function(){
        return Session.get('complexGame');
    },

    selectedShip: function(){
        //opponent: pairs, challenger: impairs
        var turn = (Meteor.userId() == Session.get('inGame').opponent)? 0 : 1;
        return Session.get('selectedShip') && Meteor.call('getTurn') %2 == turn;
    },

    selectableShip: function(){
        var player = (Meteor.userId() == Session.get('inGame').opponent)? 'opponent': 'challenger'; 
        return true;//(Session.get('selectedShip').owner == player);
    }
});


Template.contextMenu.helpers({
    currentTurn: function() {
        var turn = (Meteor.userId() == Session.get('inGame').opponent)? 0 : 1;
        var gameTurn = Session.get('inGame').turn;
        console.log(gameTurn%2 == turn);
        return (gameTurn %2 == turn);
    },

    selectedShip: function(){
        //opponent: pairs, challenger: impairs
        var turn = (Meteor.userId() == Session.get('inGame').opponent)? 0 : 1;
        var gameTurn = Session.get('inGame').turn;
        console.log(gameTurn%2 == turn);
        return Session.get('selectedShip');
    }

});

Template.contextMenu.events({
    'click .actionButton' : function(evt) {
        var action = evt.target.id;
        if(Session.get('complexGame')) {
            if (action == 'moveShip'){
                canvas.moveShip(Session.get('selectedShip'), 2, new THREE.Vector3(1,0,0));
                canvas.setVisibleFromName(getCurrentMap());
            }
            else if (action =='turnShipRight'){
                canvas.rotateShip(Session.get('selectedShip'), new THREE.Vector3(0,1,0), -0.5* Math.PI);
            }
            else if (action =='turnShipLeft'){ 
                canvas.rotateShip(Session.get('selectedShip'), new THREE.Vector3(0,1,0), 0.5* Math.PI);
            }
        }
        console.log('selected action:');
        console.log(action);
        Session.set('selectedAction', action);
    },
    'click #turnShipLeft' : function(evt) {
        console.log('turning ship counterclockwise');
        //map.turnShip(ship, Math.PI*0.5); 

        Meteor.call('completeTurn', 'turnShipLeft', Session.get('selectedShip'));
    },

    'click #turnShipRight' : function(evt) {
        console.log('turning ship counterclockwise');
        //map.turnShip(ship, Math.PI*0.5); 

        Meteor.call('completeTurn', 'turnShipRight', Session.get('selectedShip'));
    }

});
