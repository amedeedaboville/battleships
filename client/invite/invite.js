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

    gameCollection.find({active: true}).observeChanges({
        added: function(id, fields){
            if (fields.mapAccepted == 13){
                console.log('a game was loaded!');
                Session.set('currentMap', fields.map);
                Session.set('showModal', false);
                Session.set('showLoadModal', false);
                Session.set('inGame',id);
                $('#acceptMapButton').prop('disabled', false);
            }
            else{
                console.log('a game was inserted!');
                Session.set('currentMap', fields.map);
                Session.set('showModal', true);
                Session.set('showLoadModal', false);
            }

        },
        changed: function(id, fields) {
            // handle map being reloaded...
            if (fields.mapAccepted == 13){
                Session.set('showModal', false);
                Session.set('inGame',id);
                $('#acceptMapButton').prop('disabled', false);
                $('#newMapButton').prop('disabled', false);
            }

            else if(fields.mapsLeft){
                if (fields.mapsLeft >=1){
                    Session.set('currentMap', fields.map);
                     $('#acceptMapButton').prop('disabled', false);
                }
                else{
                     $('#newMapButton').prop('disabled', true);
                    //close both windows
                }
            }

            else{
                if (getCurrentGame()){
                    Session.set('currentMap', getCurrentGame().map);
                    Session.set('selectedShip', undefined);
                }
            }
        },
        removed: function(collection, id){
            console.log('a game was removed');
            $('#acceptMapButton').prop('disabled', false);
            $('#newMapButton').prop('disabled', false);
            Session.set('showModal', false);
            clearSessionVars();
        }

    });
});
