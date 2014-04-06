// Deps.autorun(function() {
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

    mapCollection.find().observeChanges({
        added: function(id, fields){
           Session.set('currentMap', mapCollection.findOne());
        },
        changed: function(id, fields){
            // console.log(fields);
           // var map = Session.get('currentMap');
           // map.squares = fields.squares;
            //map.shipDictionary = fields.shipDictionary;
            console.log(new Date());
           Session.set('currentMap', mapCollection.findOne());//TO-DO!
            console.log('done with map update');
        }

    });

    gameCollection.find().observeChanges({
        added: function(id, fields){
            Session.set('showModal', true);
        },
        changed: function(id,fields) {
            // console.log(fields);
            if (fields.mapAccepted == 13){
                 Session.set('showModal', false);
                 Session.set('inGame', id);
            }

            else if (fields.mapsLeft){
                 console.log('ZOMG! we need a new map!');
                 //Session.set('inGame', newDocument);
                 //Session.set('currentMap', fields.mapID);//TO-DO!
                 $('#acceptMapButton').prop('disabled', false);
            }

            else if (!fields.mapAccepted){
                 //Session.set('inGame', newDocument);
                 //Session.set('currentMap', fields.mapID);//TO-DO!
            }
        },
        removed: function(id){
            $('#acceptMapButton').prop('disabled', false);
            $('#newMapButton').prop('disabled', false);
            $('#mapModal').modal('hide');
            Session.set('inGame', undefined);
            //Session.set('currentMap', undefined);
        }
    });
// });
