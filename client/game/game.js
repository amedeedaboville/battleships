Template.game.helpers({
    complexGame: function(){
        return Session.get('complexGame');
    },
});


Template.contextMenu.helpers({
    currentTurn: function() {
        var turn = (Meteor.userId() == getCurrentGame().opponent)? 0 : 1;
        var gameTurn = getCurrentGame().turn;
        return (gameTurn %2 == turn);
    },

    firstTurn: function() {
        var gameTurn =  getCurrentGame().turn;
        return (gameTurn == 0 || gameTurn == 1);
    },

    selectedShip: function(){
        //opponent: pairs, challenger: impairs
        var turn = (Meteor.userId() == getCurrentGame().opponent)? 0 : 1;
        var gameTurn = getCurrentGame().turn;
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

        if (action != 'extendRadar' && action !='healShip')
            Session.set('selectedAction', action);
        /*

        if (action == 'moveShip') {
           
            var all = document.getElementsByClassName('bow');
            for (var i = 0; i < all.length; i++) {
                all[i].style.border = 'thick solid #000000';
            }
 
        } */
        //if the selected action is move ship, show the ship movement space. If it is a fire cannon, show the fire 
        //document.getElementById("myDiv").style.border="thick solid #0000FF";

        //what needs to be done: identify cannonsquares and movementsquares in the html, ship's id
  
     
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
    },

    'click #rearrange' : function(evt) {
        var isOpponent = getCurrentGame().opponent;
        console.log('rearranging ships');
        Meteor.call('rearrange', isOpponent);
    },

    'click #extendRadar' : function(evt) {
        Meteor.call('completeTurn', 'extendRadar', Session.get('selectedShip'));
    },
    'click #healShip' : function(evt) {
        Meteor.call('completeTurn', 'healShip', Session.get('selectedShip'));
    }


});
