Deps.autorun(function() {
    inviteCollection.find({opponent: Meteor.userId()}).observeChanges({
        added: function(id, fields) {
            var user = Meteor.users.findOne(fields.challenger)
            if (user != undefined) {
                var challengeString = "";
                if (fields.gameID) {
                    challengeString = " challenged you continue the duel: " + gameCollection.findOne({_id: fields.gameID}).name;
                }
                else {
                    challengeString = " challenged you to a battleship duel!";
                }
                var notification = $.UIkit.notify(user.username + challengeString + 
                    "<button id='acceptInviteButton' class='btn btn-default left-buffer right-buffer'>Ok</button>" + 
                    "<button id='cancelInviteButton' class='btn btn-default right-buffer'>cancel</button>",
                    {status: 'info'});
                $('#acceptInviteButton').click(function(){
                    inviteCollection.update({_id: id}, {$set: {accepted: true, gameID: fields.gameID}});
                });
                $('#cancelInviteButton').click(function(){
                    notification.close();
                    Meteor.call("removeAllInvites")
                });
            }
        }
        });

    // inviteCollection.find({$or: [{opponent: Meteor.userId()}, {challenger: Meteor.userId()} ]}).observeChanges({
    //     changed: function(id, newInvite) {
    //         if (newInvite.gameID){

    //         }





    //         var invite = inviteCollection.findOne({_id: id});
    //         if(newInvite.accepted) { //an invite just got accepted
    //             if (newInvite.gameID) { //to load a previous game
    //                 console.log('invite accepted with game id' + invite.gameID);
    //                 console.log(newInvite);
    //                 var game = savedCollection.findOne({_id: invite.gameID});
    //                 savedCollection.update({_id: invite.gameID}, {$set : {active: true}}); //now it will be in the gamecollection
    //                 Session.set('currentMap', game.map);
    //                 Session.set('inGame', game);
    //                 $('#loadModal').modal('hide');
    //             }
    //             else if(newInvite.gameID == undefined)  {//to play a new game
    //                 console.log('invite accepted without an id');
    //                 console.log(newInvite);
    //                 if(invite.opponent == Meteor.userId()) {
    //                     Session.set('opponentID', invite.challenger);
    //                 }
    //                 else {
    //                     Session.set('opponentID', invite.opponent);
    //                 }
    //                 //Session.set('showModal', true);
    //                 $('#mapModal').modal('show');
    //             }
    //             else {
    //                 console.log('error');
    //                 console.log('invite accepted without an id');
    //             }
    //         }

    //         else if(invite.accepted && newInvite.gameID) {//the new game just came in, should be in the gameCollection
    //             var game = gameCollection.findOne({_id: newInvite.gameID});
    //             //gameCollection.update({_id: newInvite.gameID}, {$set : {active: true}});
    //             Session.set('inGame', game);
    //             Session.set('currentMap', game.map);
    //             //$('#loadModal').modal('hide');
    //             //Session.set('showModal', true);
    //         }
    //             else {
    //                 console.log('error 2');
    //             }
    //     }
    // });

    gameCollection.find({active: true}).observeChanges({
        added: function(id, fields){
            console.log(fields);
            console.log('a game was inserted!');
            Session.set('currentMap', fields.map);
            Session.set('showModal', true);
            Session.set('showLoadModal', false);

        },
        changed: function(id, fields) {
            // handle map being reloaded...
            if (fields.mapAccepted == 13){
                Session.set('showModal', false);
                Session.set('inGame',id);
                $('#acceptMapButton').prop('disabled', false);
            }

            else if(fields.mapsLeft){
                if (fields.mapsLeft >0){
                    console.log(fields);
                    Session.set('currentMap', fields.map);
                     $('#acceptMapButton').prop('disabled', false);
                }
                else{
                     $('#newMapButton').prop('disabled', true);
                    //close both windows
                }
            }

            else if (fields.turn){
                Session.set('currentMap', getCurrentGame().map);
            }
           //  if(fields.active === false) {
           //      console.log('game changed, not active');
           //      console.log(fields);
           //      console.log(gameCollection.findOne({_id:id}));
           //      $.UIkit.notify('The game has been become inactive.')
           // // clearSessionVars();
           //  }
        },
        removed: function(id, fields){
//             $('#acceptMapButton').prop('disabled', false);
//             $('#newMapButton').prop('disabled', false);
//             Session.set('showModal', false);
// //                 $('#mapModal').modal('hide');
//             clearSessionVars();

        }

    });
//     gameCollection.find().observe({
//         changed: function(newDocument, oldDocument) {
// // <<<<<<< HEAD
// //             if (newDocument.mapsLeft > 0){
// //                  if (newDocument.mapAccepted == 13){
// //                     if (newDocument.mapAccepted != oldDocument.mapAccepted){
// //                          Session.set('showModal', false);
// //                          Session.set('inGame', newDocument);
// //                     }
// //                     else{
// //                          Session.set('currentMap', newDocument.map);
// //                          Session.set('inGame', newDocument);
// //                          Session.set('selectedShip', undefined);
// //                      }
// //                  }
// //                  else if (newDocument.mapsLeft < oldDocument.mapsLeft){
// //                      console.log('ZOMG! we need a new map!');
// //                      Session.set('inGame', newDocument);
// //                      Session.set('currentMap', newDocument.map);
// //                      $('#acceptMapButton').prop('disabled', false);
// //                  }
// //                  else{
// //                      console.log('map received?');
// //                  }
// // =======
//             Session.set('inGame', newDocument);
//             Session.set('currentMap', newDocument.map);

//             if (newDocument.mapAccepted >= 13) {
//                 Session.set('showModal', false);
//                 console.log('cool the map got accepted');
//                 //Session.set('inGame', newDocument);
//             }
//             else if (oldDocument.mapAccepted >= 13) {
//                 //Session.set('inGame', newDocument);
//                 Session.set('showModal', false);
//                 console.log('map was already accepted')
// // >>>>>>> loadsave
//             }
//             else if (newDocument.mapsLeft < oldDocument.mapsLeft) { //got a new map, does the user want to accept?
//                 $('#acceptMapButton').prop('disabled', false);
//             }
//             else if(newDocument.mapsLeft == 0) { //out of maps
//                 $('#newMapButton').prop('disabled', true);
//             }
//             else {
//                 console.log('new doc');
//                 console.log(newDocument);
//                 console.log('old doc');
//                 console.log(oldDocument);
//             }
//         },
//             removed: function(newDoc, oldDocument){
//                 console.log('game got removed');
//                 console.log(newDoc);
//                 $('#acceptMapButton').prop('disabled', false);
//                 $('#newMapButton').prop('disabled', false);
//                 $('#mapModal').modal('hide');
//                 clearSessionVars();
//             }
//     });
});
