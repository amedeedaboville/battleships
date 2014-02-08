Deps.autorun(function (){
inviteStream.on(Meteor.userId(), function(otherUser, otherUsername) {
    console.log('received invite from' + otherUser);
    new ui.Confirmation({message: otherUsername + " wants to challenge you to a battleship duel!"}).show(function(accept){
        if (accept) {
            serverStream.emit('generate-map', Meteor.userId(), otherUser); 
        };
    }).hide(5555);
});

});

