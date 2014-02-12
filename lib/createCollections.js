gameCollection = new Meteor.Collection('games');
inviteCollection = new Meteor.Collection('invites');
inviteCollection.allow({
    'insert': function (userId,doc) {
        /* user and doc checks ,
           return true to allow insert */
        return true; 
    },
    'update': function (userId,doc) {
        /* user and doc checks ,
           return true to allow insert */
        return true; 
    }
});
