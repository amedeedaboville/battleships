Template.grid.helpers({
    rows: function () {
        var game = Session.get('currentGame');
        if (game != undefined) {
            console.log('game exits, pulling grid');
            game.map.__proto__ = new Map(); //get instance methods back
            if (Meteor.userId() == Session.get('currentGame').challenger){
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

Template.grid.rendered = function(){
  var container;
  var camera, renderer, startingPosition;
  var projector, plane, scene, grid, shareDialog;
  var mouse2D, mouse3D, raycaster, objectHovered;
  var isShiftDown = false, isCtrlDown = false, isMouseDown = false, isAltDown = false, isSpawn = false, isComplexBrush = false;
  var onMouseDownPosition = new THREE.Vector2(), onMouseDownPhi = 60, onMouseDownTheta = 45;
  var radius = 1800, theta = 0, phi = 135;
  var target = new THREE.Vector3( 0, 200, 0 );
  var color = 0;
  var CubeMaterial = THREE.MeshBasicMaterial;
  var brushX = 30;
  var brushY = 30;
  var brushZ = 30;
  var cube = new THREE.CubeGeometry( brushX, brushY, brushZ, 1, 1, 1  );
  var wireframe = true, fill = true;
  var LOWLEVELS = 20;
  var TOPLEVELS = 12;
  var NLEVELS = LOWLEVELS+TOPLEVELS;
  var baseLevel = LOWLEVELS;
  var NUM_COLS = 14;
  var spawnOffset = 0;
  var FURTHEST = 15000;
  var CLOSEST = 1000;
  var COMPLEX_BLOCKS = 17;
  var baseTerrain;

    init();
  function init() {
    //container = $("myChart");
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / (window.innerHeight*3), 1, 22000 )
    camera.position.x = radius * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 )
    camera.position.y = radius * Math.sin( phi * Math.PI / 360 )
    camera.position.z = radius * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 )

    scene = new THREE.Scene()

    // Grid
    var squares = 30;

    var size = squares/2*30, step = squares

    var geometry = new THREE.Geometry()

    for ( var i = - size; i <= size; i += step ) {

      geometry.vertices.push( new THREE.Vector3( - size, 0, i ) )
      geometry.vertices.push( new THREE.Vector3(   size, 0, i ) )

      geometry.vertices.push( new THREE.Vector3( i, 0, - size ) )
      geometry.vertices.push( new THREE.Vector3( i, 0,   size ) )

    }

    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } )

    var line = new THREE.Line( geometry, material )
    line.type = THREE.LinePieces
    grid = line
    scene.add( line )

    // Plane

    projector = new THREE.Projector()

    plane = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ), new THREE.MeshBasicMaterial() )
    plane.rotation.x = - Math.PI / 2
    plane.visible = true
    scene.add( plane )

    mouse2D = new THREE.Vector3( 0, 10000, 0.5 )

    // Brush
    var brushMaterials = [
      new CubeMaterial( { vertexColors: THREE.VertexColors, opacity: 0.5 } ),
      new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } )
    ]
//    brushMaterials[0].color.setRGB(colors[0][0], colors[0][1], colors[0][2])
    brush = THREE.SceneUtils.createMultiMaterialObject( cube, brushMaterials )
    brush.isBrush = true
    brush.overdraw = true
    scene.add( brush )

    renderer = new THREE.CanvasRenderer()
    renderer.setSize( window.innerWidth/3, window.innerHeight/2 )

    $("#myChart").append(renderer.domElement)

//    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false )
    // renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false )
    // renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false )
    // document.addEventListener( 'keydown', onDocumentKeyDown, false )
    // document.addEventListener( 'keyup', onDocumentKeyUp, false )
    
    //detect wheel support
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
              document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
              "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
              
//    window.addEventListener('DOMMouseScroll', mousewheel, false);
     if (support == "wheel")
        window.addEventListener('wheel', wheel, false);
    else
    window.addEventListener('mousewheel', mousewheel, false);

    function mousewheel( event ) {
            zoom(event.wheelDeltaY)
    }

    function wheel( event ) {
            zoom(event.deltaY*-50)
    }

    function render() {
        camera.lookAt( target );
        raycaster = projector.pickingRay( mouse2D.clone(), camera )
        renderer.render( scene, camera );
    }
    render();

//    window.addEventListener( 'resize', onWindowResize, false )

//    if ( window.location.hash ) buildFromHash()

  }



}

Template.grid.events({
    'click .square' : function(evt) {
        var action = Session.get('selectedAction');
        if(action != undefined && action !== "") {
            var position = JSON.parse($(evt.target).attr('position'))
    console.log("completing action " + action + " with position " + position);
    Meteor.call(action, Session.get('currentGame')._id, Session.get('selectedShip'), position, function(error,result){if(result)$.UIkit.notify('Cruiser fired a cannonShot at position (' + position[0] + "," + position[1]+')')});
        }
        Session.set('selectedAction', "");
    },
'click .square.ship.challenger' : function (evt) {
    g = Session.get('currentGame');
    if (g.challenger == Meteor.userId()){
        //get shipName from this square and find the ship
        var ship = g.map.shipDictionary[this.shipName];
        Session.set('selectedShip', ship)
    }

    else{
        //handle clicking opponent's ship
        Session.set('selectedShip', undefined);
    }
},

    'click .square.ship.opponent' : function (evt) {
        g = Session.get('currentGame');
        if (g.opponent == Meteor.userId()){
            var ship = g.map.shipDictionary[this.shipName];
            Session.set('selectedShip', ship)
        }


    },

    'click .square.sea' : function (evt){
        Session.set('selectedShip', undefined);
    },

    'click .square.coral' : function (evt){
        Session.set('selectedShip', undefined);
    }

//     'mouseenter .square.ship' : function (evt) {
// }
})

Deps.autorun(function(){
    Session.get('selectedShip');
});
