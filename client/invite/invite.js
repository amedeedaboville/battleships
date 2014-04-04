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

    gameCollection.find().observe({
        added: function(newDocument, oldDocument){
            Session.set('currentMap', newDocument.map);
            Session.set('mapId',newDocument.mapID);
            Session.set('showModal', true);
        },
        changed: function(newDocument, oldDocument) {
            if (newDocument.mapsLeft > 0){
                 if (newDocument.mapAccepted == 13){
                    if (newDocument.mapAccepted != oldDocument.mapAccepted){
                         Session.set('showModal', false);
                         Session.set('inGame', newDocument);
                    }
                    else{
//                        console.log(newDocument.map.shipDictionary);
                         Session.set('inGame', newDocument);
                         Session.set('currentMap', newDocument.map);
                     }
                 }
                 else if (newDocument.mapsLeft < oldDocument.mapsLeft){
                     console.log('ZOMG! we need a new map!');
//                     Session.set('currentMap', newDocument.mapID)
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
            $('#mapModal').modal('hide');
            Session.set('inGame', undefined);
            //Session.set('currentMap', undefined);
        }
    });
});
