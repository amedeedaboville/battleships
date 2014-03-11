Deps.autorun(function() {
    Meteor.subscribe('invites', Meteor.userId());
    inviteCollection.find({opponent : Meteor.userId()}).observeChanges({ //Hotfix for only showing when you're challenged to
        added: function(id, fields) {
            var inviteID = id;
            new ui.Confirmation({message: Meteor.users.findOne(fields.challenger).username + ' wants to challenge you to a battleship duel!'}).show(function(accept){
                if (accept) {
                    this.hide();
                    inviteCollection.update({_id: inviteID}, {$set: {accepted: true}});
                }
                else {
                    inviteCollection.update({_id: inviteID}, {$set: {accepted: false}});
                }
            }).hide(555500);
        }
    });

    inviteCollection.find({$or: [{opponent : Meteor.userId()}, {challenger: Meteor.userId()} ]}).observeChanges({
        changed: function(id, fields) {
            if (fields.gameID != 0) {
                //show map selection
                $('#mapModal').modal();
                currentGame = gameCollection.find({_id: fields.gameID}).fetch();
                console.log(currentGame);
            }
        }
    });
});
