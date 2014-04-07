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
                    inviteCollection.update({_id: id}, {$set: {accepted: true}});
                });
                $('#cancelInviteButton').click(function(){
                    notification.close();
                    Meteor.call("removeAllInvites")
                });
            }
        }
        });

    inviteCollection.find({$or: [{opponent :Meteor.userId()}, {challenger: Meteor.userId()} ]}).observeChanges({
        changed: function(id, newInvite) {
            var invite = inviteCollection.findOne({_id: id});
            if(invite.accepted) {
                if(invite.gameID) {
                    var game = gameCollection.findOne({_id: invite.gameID});
                    Session.set('currentMap', game.map);
                    Session.set('inGame', game);
                    $('#loadModal').modal('hide');
                }
                else {
                    Session.set('showSavedGames', true);
                    if(invite.opponent == Meteor.userId()) {
                        Session.set('opponentID', invite.challenger);
                    }
                    else {
                        Session.set('opponentID', invite.opponent);
                    }
                    Session.set('showModal', true);
                }
            }
        }
    });

    gameCollection.find().observe({
//        added: function(newDocument, oldDocument){
//            Session.set('currentMap', newDocument.map);
//            Session.set('showModal', true);
//        },
        changed: function(newDocument, oldDocument) {
            Session.set('inGame', newDocument);
            Session.set('currentMap', newDocument.map);

            if (oldDocument.mapAccepted == 13) {
                //Session.set('inGame', newDocument);
            }
            else if (newDocument.mapAccepted == 13) {
                Session.set('showModal', false);
                //Session.set('inGame', newDocument);
            }
            else if (newDocument.mapsLeft < oldDocument.mapsLeft) { //got a new map, does the user want to accept?
                $('#acceptMapButton').prop('disabled', false);
            }
            else if(newDocument.mapsLeft == 0) { //out of maps
                $('#newMapButton').prop('disabled', true);
            }
        },
            removed: function(oldDocument){
                $('#acceptMapButton').prop('disabled', false);
                $('#newMapButton').prop('disabled', false);
                $('#mapModal').modal('hide');
                Session.set('inGame', undefined);
                //Session.set('currentMap', undefined);
            }
    });
});
