canvas = undefined;
complexGridState = 'C';

Template.complexGrid.created = function(){
    console.log('grid created');
    if (complexGridState == 'R')
        complexGridState = 'RC';
    else
        complexGridState = 'C';
}

Template.complexGrid.rendered = function(){
    console.log('grid rendered');
    var m = getCurrentMap();

    if (complexGridState == 'C'){
        console.log('firstTime');
        canvas = new Canvas();
        canvas.drawCanvas(m);
        complexGridState = 'R';
    }

    else if (complexGridState == 'RC'){
        console.log('grid recreated');
        canvas.drawCanvas(m);
        canvas.controls = new THREE.OrbitControls(canvas.camera);
        canvas.loadWater();
        complexGridState = 'R';
    }

    else if (complexGridState == 'R'){
        console.log('just regular grid');
    }

    Meteor.Loader.loadJs('OrbitControls.js', function(){
        canvas.controls = new THREE.OrbitControls(canvas.camera);

    }, function(){console.log('lol')});
    Meteor.Loader.loadJs('water-material.js', function(){
            canvas.loadWater();
            mainLoop()
        });
}

Template.complexGrid.events({
    'click canvas' : function (evt){
        evt.preventDefault();
        if (canvas.objectHovered){

            //find out if you are the opponent
            var owner = Meteor.userId() == getCurrentGame().opponent? 'opponent': 'challenger';
            console.log(owner);
            console.log(canvas.objectHovered.shipInfo.owner);
            if (canvas.objectHovered.shipInfo.owner == owner){
                Session.set('selectedShip', canvas.objectHovered.shipInfo);
            }
        }
        return false;
    },

    'mousedown canvas' : function (evt){ 
        evt.preventDefault();
        canvas.mousedown = true;
        canvas.controls.onMouseDown(evt);
        canvas.controls.update();
    },

    'mouseup canvas' : function (evt){
        evt.preventDefault();
        canvas.mousedown = false;
        canvas.controls.onMouseUp(evt);
        canvas.controls.update();
   },

    'mousemove canvas' : function (evt){
        evt.preventDefault();
        if (canvas.mousedown){
            canvas.controls.onMouseMove(evt);
            canvas.controls.update();
        }
        else{
                canvas.mouse2D.x = ( event.clientX / (canvas.RENDER_WIDTH) ) * 2 - 1;
                canvas.mouse2D.y = - ( event.clientY / canvas.RENDER_HEIGHT ) * 2 + 1;
                canvas.mouse2D.z = 0.5;

                canvas.raycaster = canvas.projector.pickingRay( canvas.mouse2D.clone(), canvas.camera );
                canvas.interact();
        }

    },

    'mousewheel canvas' : function (evt){
        var delta = evt.originalEvent.wheelDeltaY/6;
        var origin = {x: 0, y: 0, z: 0}
        var distance = canvas.camera.position.distanceTo(origin)
        var tooFar = distance  > canvas.FURTHEST
        var tooClose = distance < canvas.CLOSEST
        if (delta < 0 && tooFar) return
        if (delta > 0 && tooClose) return
        canvas.controls.onMouseWheel(evt.originalEvent);
        canvas.controls.update();
    }
})


mainLoop = function mainLoop(){
    window.requestAnimationFrame(mainLoop);
    canvas.updateThing();
}