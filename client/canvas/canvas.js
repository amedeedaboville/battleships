Canvas = function(){

  this.container;
  this.camera;
  this.renderer;
  this.pointerDetectRay;
  this.projector, this.plane, this.scene;
  this.mouse2D, this.mouse3D, this.raycaster, this.objectHovered;
  this.isMouseDown = false;
  this.onMouseDownPosition = new THREE.Vector2(), this.onMouseDownPhi = 135 , this.onMouseDownTheta = 0;
  this.radius = 1500, this.theta = 0, this.phi = 35;
  this.cameraTarget = new THREE.Vector3( 0, 20, 0 );
  this.ships = new THREE.Object3D();
  this.objectHovered;
  var FURTHEST = 4500;
  var CLOSEST = 1000;
  var RENDER_HEIGHT = window.innerHeight; 
  var RENDER_WIDTH = window.innerWidth;

//  drawCanvas();
  this.drawCanvas = function(shipDictionary) {
    console.log($(window).width())
    console.log($(window).height())
    console.log($('#myChart').innerHeight())
    console.log($('#myChart').height())
    this.camera = new THREE.PerspectiveCamera( 22, RENDER_WIDTH / RENDER_HEIGHT, 1, 27000 )
    this.camera.position.x = this.radius * Math.sin( this.theta * Math.PI / 360 ) * Math.cos( this.phi * Math.PI / 360 )
    this.camera.position.y = this.radius * Math.sin( this.phi * Math.PI / 360 )
    this.camera.position.z =this.radius * Math.cos( this.theta * Math.PI / 360 ) * Math.cos( this.phi * Math.PI / 360 )

    this.scene = new THREE.Scene()

    // Grid
    var squares = 25;
    var size = squares*15, step = squares

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
    this.scene.add( line )

    // Plane
    this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 750, 750 ), new THREE.MeshBasicMaterial({wireframe:true}) )
    this.plane.rotation.x = - Math.PI / 2
    this.plane.visible = true
    this.plane.name = 'plane'
    this.scene.add( this.plane )

    this.raycaster = new THREE.Raycaster();
    this.raycaster.ray.direction.set( 0,0,0);
    this.projector = new THREE.Projector();
    this.mouse2D = new THREE.Vector3( 0, 0, 0 );


    //addShips
    this.addShips(shipDictionary);

    console.log($('#myChart')[0]);
    this.renderer = new THREE.WebGLRenderer();//$('#myChart')[0]);
    this.renderer.setSize( RENDER_WIDTH-40, RENDER_HEIGHT-180-5)
    console.log(this.renderer);

    $('#myChart').append(this.renderer.domElement)
    this.render();
}

  this.addShips = function(shipDictionary){
    for (ship in shipDictionary){
      var start = [shipDictionary[ship].sternPosition[0],shipDictionary[ship].sternPosition[1]];
      var s = new Ship3D(start[1], start[0], shipDictionary[ship].shipLength, shipDictionary[ship].name, shipDictionary[ship].orientation);

      s.createShip();
      s.ship.shipInfo = shipDictionary[ship];
      this.ships.add(s.ship);
    }
    this.scene.add(this.ships);
  }


  this.zoom = function(delta) {
    var origin = {x: 0, y: 0, z: 0}
    var distance = this.camera.position.distanceTo(origin)
    console.log(distance);

    console.log(this.camera.position);
    var tooFar = distance  > FURTHEST
    var tooClose = distance < CLOSEST
    if (delta > 0 && tooFar) return
    if (delta < 0 && tooClose) return
   this.radius = distance // for mouse drag calculations to be correct
    this.camera.translateZ( delta)
    this.camera.updateMatrixWorld(true);
    this.render()

  }
  this.render = function() {
        this.camera.lookAt( this.cameraTarget );
        this.raycaster = this.projector.pickingRay( this.mouse2D.clone(), this.camera )
        this.renderer.render( this.scene, this.camera );
    }

    this.onMouseMove = function( event ) {

    event.preventDefault()
    if ( this.isMouseDown ) {
    $('body').css( 'cursor', 'all-scroll' ); 

      this.theta = - ( ( event.clientX - this.onMouseDownPosition.x ) * 0.5 ) + this.onMouseDownTheta
      this.phi = ( ( event.clientY - this.onMouseDownPosition.y ) * 0.5 ) + this.onMouseDownPhi

      this.phi = Math.min( 135, Math.max( 0, this.phi ) )

      this.camera.position.x =this.radius * Math.sin( this.theta * Math.PI / 360 ) * Math.cos( this.phi * Math.PI / 360 )
      this.camera.position.y =this.radius * Math.sin( this.phi * Math.PI / 360 )
      this.camera.position.z =this.radius * Math.cos( this.theta * Math.PI / 360 ) * Math.cos( this.phi * Math.PI / 360 )
      this.camera.updateMatrix()
      this.camera.lookAt( this.cameraTarget );

    }

    this.mouse2D.x = ( event.clientX / (RENDER_WIDTH) ) * 2 - 1;
    this.mouse2D.y = - ( event.clientY / RENDER_HEIGHT ) * 2 + 1;
    this.mouse2D.z = 0.5;

        this.raycaster = this.projector.pickingRay( this.mouse2D.clone(), this.camera )
    this.interact()
    this.camera.updateMatrixWorld(true);
  //      this.renderer.render( this.scene, this.camera );
    this.render()
  }

  this.onMouseDown = function( event ) {
    event.preventDefault();
    this.isMouseDown = true
    this.onMouseDownTheta = this.theta
    this.onMouseDownPhi = this.phi
    this.onMouseDownPosition.x = event.clientX;
    this.onMouseDownPosition.y = event.clientY
  }

  this.findParentShip = function(element){
    if(element == undefined){
      return undefined;
    }

    var parent = element.object;
    while(parent != undefined)
    {
        if (parent.name.length != 0){
          return parent;
        }
          parent = parent.parent;

    }
      return undefined;
  }

  this.getIntersecting = function() {
   // this.raycaster = this.projector.pickingRay( this.mouse2D.clone(), this.camera )
    var intersections = this.raycaster.intersectObjects( this.scene.children, true )
    if (intersections.length > 0) {
      var intersect = this.findParentShip(intersections[1]);//only 1 ship ever intersects
      return intersect
    }
  }
  
  this.interact = function() {
    if (typeof this.raycaster === 'undefined') return

    if ( this.objectHovered ) {
      this.objectHovered.traverse( function (node){
        if (node.material){
          node.material.opacity = 1;
          node.material.transparent = true;
        }
      })

      Session.set('selectedShip', this.objectHovered.shipInfo);

      this.objectHovered = null
    }

    var intersect = this.getIntersecting()

    if ( intersect ) {
      this.objectHovered = intersect;
      this.objectHovered.traverse( function (node){
        if (node.material){
          node.material.opacity = 0.5; 
          node.material.transparent = true;
        }
      })
    }
  }



  this.onMouseUp = function( event ) {
    event.preventDefault()
    this.isMouseDown = false;
    $('body').css( 'cursor', 'auto' );
    this.onMouseDownPosition.x = event.clientX - this.onMouseDownPosition.x
    this.onMouseDownPosition.y = event.clientY - this.onMouseDownPosition.y

    if ( this.onMouseDownPosition.length() > 5 ) return

    var intersect = this.getIntersecting()

    if ( intersect ) {

      if ( isShiftDown ) {

        if ( intersect.object != plane ) {

          this.scene.remove( intersect.object.parent )

        }
      } else {
        ;//addVoxel()
      }

    }


   this.render()
  this.interact()
  }
}