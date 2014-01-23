var trimInput = function(val) {
  //from SO: The part to the left matches any leading spaces (^), the part to the right matches any trailing space ($).
  //The g modifier allows this matching to be applied more than once. That selects the whitespace, the we replace it with "".
  return val.replace(/^\s*|\s*$/g, ""); 
}

Template.recoverpassword.events({
  'submit #recovery-form' : function(e, t) {
    e.preventDefault();
    var email = trimInput(t.find('#recovery-email').value);

    if (isNotEmpty(email) && isEmail(email)) {
      Session.set('loading', true);
      Accounts.forgotPassword({email: email}, function(err){
        if (err)
          Session.set('displayMessage', 'Password Reset Error &amp; Doh')
        else {
          Session.set('displayMessage', 'Email Sent &amp; Please check your email.')
        }
      Session.set('loading', false);
      });
    }
    return false; 
  }
});
Template.loginPage.newPassword = function() {
  return false;
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
    Accounts.createUser({email: email, password : password, username: name}, function (err) {
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

