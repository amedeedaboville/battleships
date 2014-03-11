Deps.autorun(function() {
    Meteor.subscribe('invites', Meteor.userId());
    inviteCollection.find({opponent : Meteor.userId()}).observeChanges({ //Hotfix for only showing when you're challenged to
        added: function(id, fields) {
            console.log('received invite ' + id);
            console.log(fields);
            new ui.Confirmation({message: Meteor.users.findOne(fields.challenger).username + ' wants to challenge you to a battleship duel!'}).show(function(accept){
                if (accept) {
                    this.hide();
                    inviteCollection.update({_id: id}, {$set: {accepted: true, P1: Meteor.userId(), P2: challenger}});
                }
                else {
                    inviteCollection.update({_id: id}, {$set: {accepted: false}});
                }
            }).hide(555500);
        }
    });

    inviteCollection.find({$or: [{opponent : Meteor.userId()}, {challenger: Meteor.userId()} ]}).observeChanges({
        changed: function(id, fields) {
            if (fields.accepted == true) {
                //show map selection
                $('#mapModal').modal();

                //insert into gameCollection
                aGame = new Game();
               gameCollection.insert({player1ID: fields.player1ID, player2ID: fields.player2ID, game: aGame});


            }
        }
    });
});
