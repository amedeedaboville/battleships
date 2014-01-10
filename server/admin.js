//Accounts.registerLoginHandler(function(loginRequest) {
//
//  if(!loginRequest.admin) {
//    return undefined;
//  }
//
//  if(loginRequest.password != 'password') {
//    return null;
//  }
//
//  var userId = null;
//  var user = Meteor.users.findOne({username: 'admin'});
//  if(!user) {
//    userId = Meteor.users.insert({username: 'admin'});
//  }
//  else {
//    userId = user._id;
//  }
////creating a session token to resume the login
//  var stampedToken = Accounts._generateStampedLoginToken();
//  Meteor.users.update(userId, {$push: {'services.resume.loginTokens': stampedToken}});
//
//  return {
//    id: userId,
//    token: stampedToken.token
//  }
//});
