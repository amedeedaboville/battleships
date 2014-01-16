chatStream = new Meteor.Stream('chat'); //This doesn't.
Template.hello.greeting = function () {
  return "Welcome to battleships.";
};

var trimInput = function(val) {
  //from SO: The part to the left matches any leading spaces (^), the part to the right matches any trailing space ($).
  //The g modifier allows this matching to be applied more than once. Then we have selected all the whitespace and we replace it
  //with "".
  return val.replace(/^\s*|\s*$/g, ""); 
}

Template.login.events({
  'submit .login-form' : function (e, t) {
    e.preventDefault();

    var email = trimInput(t.find('#login-email').value);
    var password = t.find('#login-password').value;

    Meteor.loginWithPassword(email, password, function (err) {
      if (err) {
        console.log("Login failed with err");
        console.log(err);
      }
      else {
        console.log("Successful login.");
      }
    });
    return false;
  }
});
Template.register.events({
  'submit .register-form' : function (e, t) {
    e.preventDefault();

    var email = trimInput(t.find('#register-email').value);
    var password = t.find('#register-password').value;
    var name = trimInput(t.find('#register-name').value);

    console.log("Register with email " + email + " and password " + password + " and name " + name);
    Accounts.createUser({email: email, password : password, name: name}, function (err) {
      if (err) {
        console.log("Registration failed with err");
        console.log(err);
      }
      else {
        console.log("Successful registration.");
      }
    });
    return false;
  }
});

Template.hello.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
  console.log("You pressed the button");
  }
});

Template.messages.messages = function () {
  return Messages.find({}, { sort: { time: -1 }});
}
sendChat = function(message) {
  chatStream.emit('message', message);
  console.log('me: ' + message);
};

chatStream.on('message', function(message) {
  console.log('user: ' + message);
});
