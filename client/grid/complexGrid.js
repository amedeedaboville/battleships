canvas = undefined;
onlyFirstTime = true;

Template.complexGrid.rendered = function(){
    var m = Session.get('inGame').map;
    m.__proto__ = new Map();
    if (onlyFirstTime){
        canvas = new Canvas();
        canvas.drawCanvas(m);
        console.log (this._firstTime);
        this._firstTime = false;
        onlyFirstTime = false; 
    }

    else{
        console.log (this._firstTime);
        canvas.drawCanvas(m);
        canvas.loadWater();
        mainLoop();
    }

    Meteor.Loader.loadJs('OrbitControls.js', function(){
        canvas.controls = new THREE.OrbitControls(canvas.camera);

    });
    Meteor.Loader.loadJs('water-material.js', function(){
            canvas.loadWater();
            mainLoop()
        });
}

Template.complexGrid.events({
    'click canvas' : function (evt){
        evt.preventDefault();
        if (canvas.objectHovered){
          Session.set('selectedShip', canvas.objectHovered.shipInfo);
        }
    },

    'mousedown canvas' : function (evt){ 
        canvas.controls.onMouseDown(evt);
        canvas.controls.update();
    },

    'mouseup canvas' : function (evt){
        canvas.controls.onMouseUp(evt);
        canvas.controls.update();
   },

    'mousemove canvas' : function (evt){
        canvas.controls.onMouseMove(evt);
        canvas.controls.update();
    },

    'mousewheel canvas' : function (evt){
        canvas.controls.onMouseWheel(evt);
        canvas.controls.update();
    }
})


mainLoop = function mainLoop(){
    window.requestAnimationFrame(mainLoop);
    canvas.updateThing();
}