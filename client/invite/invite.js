Deps.autorun(function() {
    Meteor.subscribe('invites', Meteor.userId());
    inviteCollection.find({opponent : Meteor.userId()}).observeChanges({ //Hotfix for only showing when you're challenged to
        added: function(id, fields) {
            user = Meteor.users.findOne(fields.challenger)
            if (user != undefined){
                var notification = $.UIkit.notify(user.username + " challenges to a duel!<button id='acceptInviteButton' class='btn btn-default left-buffer right-buffer'>Ok</button><button id='cancelInviteButton' class='btn btn-default right-buffer'>cancel</button>",
                    {status: 'info'});
                $('#acceptInviteButton').click(function(){
                    inviteCollection.update({_id: id}, {$set: {accepted: true}});
                });
                $('#cancelInviteButton').click(function(){
                    notification.close();
                });
            }
        }
    });

    inviteCollection.find({$or: [{opponent : Meteor.userId()}, {challenger: Meteor.userId()} ]}).observeChanges({
        changed: function(id, fields) {
            if (fields.gameID != 0) {

                //remove everything from inviteCollection
                Meteor.call("removeAllInvites", Meteor.userId(), Meteor.userId())

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
