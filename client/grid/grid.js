Template.grid.helpers({
    rows: function () {
        var game = gameCollection.find().fetch()[0];
        if (game != undefined) {
            console.log('game exits, pulling grid');
            game.map.__proto__ = new Map(); //get instance methods back
            if (Meteor.userId() == game.challenger){
                console.log(game.map.getGrid('challenger'));
                return game.map.getGrid('challenger');
            }
            else {
                console.log(game.map.getGrid('opponent'));
                return game.map.getGrid('opponent'); 
            }
        }
    }
});

canvas = undefined;

Template.grid.created = function(){

        var controlsLoaded = function(){
            //canvas.controls = new THREE.OrbitControls(canvas.camera, canvas.renderer.domElement);
        }
        var waterLoaded = function(){
            canvas = new Canvas();
            var m = Session.get('inGame').map;
            m.__proto__ = new Map();
            canvas.drawCanvas(m);
            canvas.loadWater();
            canvas.water.render();
            mainLoop();
        }

    Meteor.Loader.loadJs('OrbitControls.js', controlsLoaded);
    Meteor.Loader.loadJs('water-material.js', waterLoaded);
}

Template.grid.rendered = function(){
    // if (currentGame != undefined)
    // {
    //     var m = currentGame.map;
    //     m.__proto__ = new Map();
    //     var visibleSquares;

    //     if (Meteor.userId() == currentGame.challenger){
    //         visibleSquares = m.getVisibleSquares('challenger');
    //     }

    //     if (Meteor.userId() == currentGame.opponent){
    //         visibleSquares = m.getVisibleSquares('opponent');
    //     }

    //     keys = Object.keys(visibleSquares);
    //     for (var i=0; i < keys.length; i++){
    //         keyvar = JSON.parse(keys[i]);
    //         var squareVisible = m.grid.squares[keyvar[0]][keyvar[1]];
    //         squareVisible = new Square();
    //         squareVisible.visibility = "id=visible";
    //     }
    // }
}

Template.grid.events({
    'click .square' : function(evt) {
        var action = Session.get('selectedAction');
        var currentGame = gameCollection.find().fetch()[0];
        if(action != undefined && action !== "") {
            var position = JSON.parse($(evt.target).attr('position'))
    console.log("completing action " + action + " with position " + position);
    Meteor.call(action, currentGame._id, Session.get('selectedShip'), position, function(error,result){if(result)$.UIkit.notify('Cruiser fired a cannonShot at position (' + position[0] + "," + position[1]+')')});
        }
        Session.set('selectedAction', "");
    },
'click .square.ship.challenger' : function (evt) {
    var currentGame = gameCollection.find().fetch()[0];
    if (currentGame.challenger == Meteor.userId()){
        //get shipName from this square and find the ship
        var ship = currentGame.map.shipDictionary[this.shipName];
        Session.set('selectedShip', ship); 
    }

    else{
        //handle clicking opponent's ship
        Session.set('selectedShip', undefined);
    }
},

    'click .square.ship.opponent' : function (evt) {
        var currentGame = gameCollection.find().fetch()[0];
        if (currentGame.opponent == Meteor.userId()){
            var ship = currentGame.map.shipDictionary[this.shipName];
            Session.set('selectedShip', ship)
        }


    },

    'click .square.sea' : function (evt){
        Session.set('selectedShip', undefined); 
    },

    'click .square.coral' : function (evt){
        Session.set('selectedShip', undefined);
    },

    'click canvas' : function (evt){
        evt.preventDefault();
        if (canvas.objectHovered){
          Session.set('selectedShip', canvas.objectHovered.shipInfo);
        }
    },

    'mousedown canvas' : function (evt){ 
        evt.preventDefault();
        canvas.isMouseDown = true
        canvas.onMouseDownTheta = canvas.theta;
        canvas.onMouseDownPhi = canvas.phi;
        canvas.onMouseDownPosition.x = evt.clientX;
        canvas.onMouseDownPosition.y = evt.clientY;
    },

    'mouseup canvas' : function (evt){
    evt.preventDefault()
    canvas.isMouseDown = false;
    $('body').css( 'cursor', 'auto' );
    canvas.onMouseDownPosition.x = evt.clientX - canvas.onMouseDownPosition.x
    canvas.onMouseDownPosition.y = evt.clientY - canvas.onMouseDownPosition.y

    if ( canvas.onMouseDownPosition.length() > 5 ) return

    var intersect = canvas.getIntersecting()

    if ( intersect ) {
        //
    }


     canvas.render()
    canvas.interact()
   },

    'mousemove canvas' : function (evt){
    evt.preventDefault()
    if ( canvas.isMouseDown ) {
        $('body').css( 'cursor', 'all-scroll' ); 

      canvas.theta = - ( ( event.clientX - canvas.onMouseDownPosition.x ) * 0.5 ) + canvas.onMouseDownTheta
      canvas.phi = ( ( event.clientY - canvas.onMouseDownPosition.y ) * 0.5 ) + canvas.onMouseDownPhi

      canvas.phi = Math.min( 135, Math.max( 20, canvas.phi ) )

      canvas.camera.position.x =canvas.radius * Math.sin( canvas.theta * Math.PI / 360 ) * Math.cos( canvas.phi * Math.PI / 360 )
      canvas.camera.position.y =canvas.radius * Math.sin( canvas.phi * Math.PI / 360 )
      canvas.camera.position.z =canvas.radius * Math.cos( canvas.theta * Math.PI / 360 ) * Math.cos( canvas.phi * Math.PI / 360 )
      canvas.camera.updateMatrix();

    }

    canvas.mouse2D.x = ( event.clientX / (canvas.RENDER_WIDTH) ) * 2 - 1;
    canvas.mouse2D.y = - ( event.clientY / canvas.RENDER_HEIGHT ) * 2 + 1;
    canvas.mouse2D.z = 0.5;

    canvas.raycaster = canvas.projector.pickingRay( canvas.mouse2D.clone(), canvas.camera )
    canvas.interact()
    canvas.render()
    },

    'mousewheel canvas' : function (evt){
        var delta = evt.wheelDeltaY/6;
        var origin = {x: 0, y: 0, z: 0}
        var distance = canvas.camera.position.distanceTo(origin)
        console.log(tooFar && delta > 0);
        console.log(tooFar);
        console.log(delta);
        var tooFar = distance  > canvas.FURTHEST
        var tooClose = distance < canvas.CLOSEST
        if (delta > 0 && tooFar) return
        if (delta < 0 && tooClose) return
        canvas.radius = distance // for mouse drag calculations to be correct
        canvas.camera.translateZ( delta)
        canvas.render()

    }
})


mainLoop = function mainLoop(){
    window.requestAnimationFrame(mainLoop);
    canvas.updateThing();
}

Deps.autorun(function(){
    Session.get('selectedShip');
});
