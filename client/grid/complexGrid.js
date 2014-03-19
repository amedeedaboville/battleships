canvas = undefined;

Template.complexGrid.created = function(){
    console.log('created complexGrid')
        var waterLoaded = function(){
            console.log(canvas);
            canvas = new Canvas();
            var m = Session.get('inGame').map;
            m.__proto__ = new Map();
            canvas.drawCanvas(m);
            //canvas.loadWater();
            //canvas.water.render();
            //mainLoop();
        }

    Meteor.Loader.loadJs('water-material.js', waterLoaded);
}

Template.complexGrid.rendered = function(){
    console.log('rendered complexGrid');
}

Template.complexGrid.events({
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