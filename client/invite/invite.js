Deps.autorun(function() {
    Meteor.subscribe('invites', Meteor.userId());
    inviteCollection.find({opponent : Meteor.userId()}).observeChanges({ //Hotfix for only showing when you're challenged to
        added: function(id, fields) {
            var inviteID = id;
            user = Meteor.users.findOne(fields.challenger)
            if (user != undefined){
                new ui.Confirmation({message: user.username + ' wants to challenge you to a battleship duel!'}).show(function(accept){
                    if (accept) {
                        this.hide();
                        inviteCollection.update({_id: inviteID}, {$set: {accepted: true}});
                    }
                    else {
                        inviteCollection.update({_id: inviteID}, {$set: {accepted: false}});
                    }
                }).hide(4000);
            };
        }
    });

    inviteCollection.find({$or: [{opponent : Meteor.userId()}, {challenger: Meteor.userId()} ]}).observeChanges({
        changed: function(id, fields) {
            if (fields.gameID != 0) {

                //remove everything from inviteCollection
                Meteor.call("removeAllInvites", Meteor.userId(), Meteor.userId())

                //accept the invite
                $('#mapModal').modal();
                currentGame = gameCollection.find({_id: fields.gameID}).fetch()[0];
                Session.set('currentGame', currentGame);
            }
        }
    });

    if(Session.get('currentGame')) {
        gameCollection.find({_id:Session.get('currentGame')._id}).observeChanges({
            changed: function(id, fields) {
                if(fields.mapAccepted) {
                    Session.set('inGame', true);
                    $('#mapModal').modal('hide');
                }
            }
        });
    }

});
