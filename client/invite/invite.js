    inviteCollection.find({opponent : Meteor.userId()}).observeChanges({
        added: function(id, fields) {
            user = Meteor.users.findOne(fields.challenger)
            if (user != undefined){
                var notification = $.UIkit.notify(user.username + " challenged you to a battleship duel!" + 
                    "<button id='acceptInviteButton' class='btn btn-default left-buffer right-buffer'>Ok</button>" + 
                    "<button id='cancelInviteButton' class='btn btn-default right-buffer'>Cancel</button>",
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
            if (fields.mapID){
                Meteor.call("removeAllInvites")
                Session.set('currentMap', fields.mapID); 
            }
        }
    });

    mapCollection.find().observe({
        changed: function(newDocument, old) {
            console.log('current map has changed');
           // Session.set('currentMap', newDocument);
        },
        removed: function(old) {
           // Session.set('currentMap', undefined);
        }
    });

    gameCollection.find().observe({
        //a game was inserted. 
        added: function(newDocument, oldDocument){
            console.log('a Game has been inserted');
            console.log(newDocument);

        },
        changed: function(newDocument, oldDocument) {
            if (newDocument.mapsLeft > 0){
                if (newDocument.mapAccepted == 13){
                    $('#mapModal').modal('hide');
                    Session.set('inGame', newDocument);
                }
                else if (newDocument.mapsLeft < oldDocument.mapsLeft){
                    console.log('ZOMG! we need a new map!');
                    Session.set('currentMap', newDocument.mapID)
                    $('#acceptMapButton').prop('disabled', false);
                }
                else{
                    console.log('map received?');
                }
            }
        else{
            console.log('we will close this cuz you guys don\'t wanna play =(')
            $('#newMapButton').prop('disabled', true);
        }
        },
        removed: function(oldDocument){
            $('#acceptMapButton').prop('disabled', false);
            $('#newMapButton').prop('disabled', false);
            console.log('removed The set up phase voluntarily');
                Session.set('inGame', undefined);
            //Session.set('currentMap', undefined);
            // $('#mapModal').modal('hide');
        }
    });

