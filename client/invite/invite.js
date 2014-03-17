Deps.autorun(function() {
    Meteor.subscribe('invites', Meteor.userId());
    inviteCollection.find({opponent : Meteor.userId()}).observeChanges({ //Hotfix for only showing when you're challenged to
        added: function(id, fields) {
            user = Meteor.users.findOne(fields.challenger)
            if (user != undefined){
                var notification = $.UIkit.notify(user.username + " challenged you to a battleship duel!<button id='acceptInviteButton' class='btn btn-default left-buffer right-buffer'>Ok</button><button id='cancelInviteButton' class='btn btn-default right-buffer'>cancel</button>",
                    {status: 'info'});
                $('#acceptInviteButton').click(function(){
                    inviteCollection.update({_id: id}, {$set: {accepted: true}});
                });
                $('#cancelInviteButton').click(function(){
                    notification.close();
                    //remove everything from inviteCollection
                    Meteor.call("removeAllInvites", Meteor.userId(), Meteor.userId())
                });
            }
        }
    });

    inviteCollection.find({$or: [{opponent : Meteor.userId()}, {challenger: Meteor.userId()} ]}).observeChanges({
        changed: function(id, fields) {
            console.log('invitation changed!');

            if (fields.gameID != 0 && fields.gameID != undefined) {

                //remove everything from inviteCollection
                Meteor.call("removeAllInvites", Meteor.userId(), Meteor.userId())
                $('#mapModal').modal();
            }
        }
    });

        gameCollection.find().observeChanges({
            changed: function(id, fields) {
                console.log('game changed!');
                if(fields.mapAccepted) {
                    Session.set('inGame', true);
                    $('#mapModal').modal('hide');
                }
            },
            removed: function(id, collection){
                    Session.set('inGame', false);
                    $('#mapModal').modal('hide');
            }
        });

});
