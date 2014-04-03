Deps.autorun(function() {
    inviteCollection.find({opponent : Meteor.userId()}).observeChanges({ //Hotfix for only showing when you're challenged to
        added: function(id, fields) {
            user = Meteor.users.findOne(fields.challenger)
            if (user != undefined){
                var notification = $.UIkit.notify(user.username + " challenged you to a battleship duel!" + 
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

    inviteCollection.find({$or: [{opponent : Meteor.userId()}, {challenger: Meteor.userId()} ]}).observeChanges({
        changed: function(id, fields) {
            if (fields.gameID != 0 && fields.gameID != undefined) {
                Meteor.call("removeAllInvites")
                $('#mapModal').modal();
            }
        }
    });

    mapCollection.find().observe({
        changed: function(newDocument, old) {
            console.log('current map has changed');
            Session.set('currentMap', newDocument);
        },
        removed: function(old) {
            Session.set('currentMap', undefined);
        }
    });

    gameCollection.find().observe({
        changed: function(newDocument, oldDocument) {
            Meteor.subscribe('maps', newDocument.mapID);
            Session.set('currentMap', mapCollection.findOne({_id: newDocument.mapID}));
            Session.set('inGame', newDocument);
            $('#mapModal').modal('hide');
        },
        removed: function(oldDocument){
            Session.set('inGame', undefined);
            Session.set('currentMap', undefined);
            $('#mapModal').modal('hide');
        }
    });
});
