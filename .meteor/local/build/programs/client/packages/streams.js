//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var EV;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/streams/lib/ev.js                                        //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
function _EV() {                                                     // 1
  var self = this;                                                   // 2
  var handlers = {};                                                 // 3
                                                                     // 4
  self.emit = function emit(event) {                                 // 5
    var args = Array.prototype.slice.call(arguments, 1);             // 6
                                                                     // 7
    if(handlers[event]) {                                            // 8
      for(var lc=0; lc<handlers[event].length; lc++) {               // 9
        var handler = handlers[event][lc];                           // 10
        handler.apply(this, args);                                   // 11
      }                                                              // 12
    }                                                                // 13
  };                                                                 // 14
                                                                     // 15
  self.on = function on(event, callback) {                           // 16
    if(!handlers[event]) {                                           // 17
      handlers[event] = [];                                          // 18
    }                                                                // 19
    handlers[event].push(callback);                                  // 20
  };                                                                 // 21
                                                                     // 22
  self.once = function once(event, callback) {                       // 23
    self.on(event, function onetimeCallback() {                      // 24
      callback.apply(this, arguments);                               // 25
      self.removeListener(event, onetimeCallback);                   // 26
    });                                                              // 27
  };                                                                 // 28
                                                                     // 29
  self.removeListener = function removeListener(event, callback) {   // 30
    if(handlers[event]) {                                            // 31
      var index = handlers[event].indexOf(callback);                 // 32
      handlers[event].splice(index, 1);                              // 33
    }                                                                // 34
  };                                                                 // 35
                                                                     // 36
  self.removeAllListeners = function removeAllListeners(event) {     // 37
    handlers[event] = undefined;                                     // 38
  };                                                                 // 39
}                                                                    // 40
                                                                     // 41
EV = _EV;                                                            // 42
///////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/streams/lib/client.js                                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Meteor.Stream = function Stream(name, callback) {                    // 1
  EV.call(this);                                                     // 2
                                                                     // 3
  var self = this;                                                   // 4
  var streamName = 'stream-' + name;                                 // 5
  var collection = new Meteor.Collection(streamName);                // 6
  var subscription;                                                  // 7
  var subscriptionId;                                                // 8
                                                                     // 9
  var connected = false;                                             // 10
  var pendingEvents = [];                                            // 11
                                                                     // 12
  self._emit = self.emit;                                            // 13
                                                                     // 14
  collection.find({}).observe({                                      // 15
    "added": function(item) {                                        // 16
      if(item.type == 'subscriptionId') {                            // 17
        subscriptionId = item._id;                                   // 18
        connected = true;                                            // 19
        pendingEvents.forEach(function(args) {                       // 20
          self.emit.apply(self, args);                               // 21
        });                                                          // 22
        pendingEvents = [];                                          // 23
      } else {                                                       // 24
        var context = {};                                            // 25
        context.subscriptionId = item.subscriptionId;                // 26
        context.userId = item.userId;                                // 27
        self._emit.apply(context, item.args);                        // 28
      }                                                              // 29
    }                                                                // 30
  });                                                                // 31
                                                                     // 32
  subscription = Meteor.subscribe(streamName, callback);             // 33
                                                                     // 34
  self.emit = function emit() {                                      // 35
    if(connected) {                                                  // 36
      Meteor.call(streamName, subscriptionId, arguments);            // 37
    } else {                                                         // 38
      pendingEvents.push(arguments);                                 // 39
    }                                                                // 40
  };                                                                 // 41
                                                                     // 42
  self.close = function close() {                                    // 43
    subscription.stop();                                             // 44
  };                                                                 // 45
}                                                                    // 46
                                                                     // 47
_.extend(Meteor.Stream.prototype, EV.prototype);                     // 48
                                                                     // 49
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.streams = {};

})();

//# sourceMappingURL=d9fa7ce792ed634ff135d053e533127e8fd1c587.map
