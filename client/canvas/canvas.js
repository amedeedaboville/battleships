Canvas = function(){

  this.container;
  this.camera = new THREE.PerspectiveCamera( 22, window.innerWidth / (window.innerHeight), 1, 27000 )
  this.renderer;
  this.projector, this.plane, this.scene;
  this.mouse2D, this.mouse3D, this.raycaster, this.objectHovered;
  this.isMouseDown = false;
  this.onMouseDownPosition = new THREE.Vector2(), this.onMouseDownPhi = 135, this.onMouseDownTheta = 0;
  this.radius = 1800, this.theta = 0, this.phi = 135;
  this.cameraTarget = new THREE.Vector3( 0, 20, 0 );
  this.ships = new THREE.Object3D();
  var FURTHEST = 4500;
  var CLOSEST = 1000;

//  drawCanvas();
  this.drawCanvas = function() {
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
    this.projector = new THREE.Projector()

    this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ), new THREE.MeshBasicMaterial({wireframe:true}) )
    this.plane.rotation.x = - Math.PI / 2
    this.plane.visible = true
    this.scene.add( this.plane )

    this.mouse2D = new THREE.Vector3( 0, 10000, 0.5 )

    for (i=10;i<20;i++){
      var s = new Ship3D(0, i, 5);
      s.createShip();
      this.ships.add(s.ship);
      var ss = new Ship3D(25, i, 5);
      ss.createShip()
      this.ships.add(ss.ship);
    }
    this.scene.add(this.ships);


    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( window.innerWidth/2.7, window.innerHeight/2 )

    $("#myChart").append(this.renderer.domElement)
    this.render();

    window.addEventListener( 'resize', onWindowResize, false )
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
    this.camera.translateZ( delta )
    this.camera.updateMatrixWorld(true);
    this.render()

  }
//    if ( window.location.hash ) buildFromHash()

  this.render = function() {
        this.camera.lookAt( this.cameraTarget );
        //console.log(mouse2D.clone());
        this.raycaster = this.projector.pickingRay( this.mouse2D.clone(), this.camera )
        this.renderer.render( this.scene, this.camera );
    }


  function onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight
   this.camera.updateProjectionMatrix()

    this.renderer.setSize( window.innerWidth, window.innerHeight )
    this.interact()
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

    }

    this.mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1
    this.mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1


    this.interact()
    this.camera.updateMatrixWorld(true);
    this.render()
  }

  this.onMouseDown = function( event ) {
    event.preventDefault()
    this.isMouseDown = true
    this.onMouseDownTheta = this.theta
    this.onMouseDownPhi = this.phi
    this.onMouseDownPosition.x = event.clientX
    this.onMouseDownPosition.y = event.clientY
  }


  this.getIntersecting = function() {
    var intersectable = this.scene.children.map(function(c) { if (c.isVoxel) return c.children[0]; return c; })
    var intersections = this.raycaster.intersectObjects( intersectable )
    if (intersections.length > 0) {
      var intersect = intersections[ 0 ].object.isBrush ? intersections[ 1 ] : intersections[ 0 ]
      return intersect
    }
  }
  
  this.interact = function() {
    if (typeof this.raycaster === 'undefined') return

    if ( this.objectHovered ) {
      this.objectHovered.material.opacity = 1
      this.objectHovered = null
    }

    var intersect = this.getIntersecting()

//     if ( intersect ) {
//       var normal = intersect.face.normal.clone()
//       // normal.applyMatrix4( intersect.object.matrixRotationWorld )
//       // var position = new THREE.Vector3().addVectors( intersect.point, normal )
      
//       // var newCube = [   Math.floor( position.x / 50 ), 
//       //                   Math.floor( position.y / 50 ), 
//       //                   Math.floor( position.z / 50 )]

//       function updateBrush() {
//         if (!isComplexBrush){
//                 brush.position.x = Math.floor( position.x / 50 ) * 50 + 25*$("#hslider").slider("value")
//                 brush.position.y = Math.floor( position.y / 50 ) * 50 + 25*$("#vslider").slider("value")//1 50 2 75 3 100
//                 brush.position.z = Math.floor( position.z / 50 ) * 50 + 25*$("#zslider").slider("value")
//             }
            
//         else{
//                 complexBrush.position.x = Math.floor( position.x / 50 ) * 50 + 25//*$("#hslider").slider("value")
//                 complexBrush.position.y = Math.floor( position.y / 50 ) * 50 + 25//*$("#vslider").slider("value")//1 50 2 75 3 100
//                 complexBrush.position.z = Math.floor( position.z / 50 ) * 50 + 25//*$("#zslider").slider("value")
//         }
//       }

//       if (isAltDown) {
//         if (!brush.currentCube) {
// //            brush.currentCube = newCube
//         }
//         if (brush.currentCube.join('') !== newCube.join('')) {
//           if ( isShiftDown ) {
//             if ( intersect.object !== plane ) {
//                 //remove from saveData
//             changeVoxelColor(intersect.object.parent, undefined)
//               scene.remove( intersect.object.parent )
//             }
//           } else {
//             addVoxel()
//           }
//         }
//         updateBrush()
//         return brush.currentCube = newCube
//       } else if ( isShiftDown ) {
//         if ( intersect.object !== plane ) {
//           objectHovered = intersect.object
//           changeVoxelColor(objectHovered.parent, undefined)
//           objectHovered.material.opacity = 0.5
//           return
//         }
//       } else {
//         updateBrush()
//         return
//       }
//     }
    //brush.position.y = 22000
  }



  this.onMouseUp = function( event ) {
    event.preventDefault()
    this.isMouseDown = false
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

  function onDocumentKeyDown( event ) {
    switch( event.keyCode ) {
      case 189: zoom(100); break
      case 187: zoom(-100); break
      // case 48: exports.setColor(0); break
      // case 49: exports.setColor(1); break
      // case 50: exports.setColor(2); break
      // case 51: exports.setColor(3); break
      // case 52: exports.setColor(4); break
      // case 53: exports.setColor(5); break
      // case 54: exports.setColor(6); break
      // case 55: exports.setColor(7); break
      // case 56: exports.setColor(8); break
      // case 57: exports.setColor(9); break
      // case 192: exports.setColor(10); break
      //left arrow
      case 37: console.log(this.camera); this.camera.translateX(100); break;//if (this.camera.position.x > 15) {this.camera.position.x-=15; this.camera.position.z+=15; } break;
      case 65: console.log(this.camera.position.x); this.camera.position.x+=45; this.camera.updateMatrix(); break;//not yet working ~ish
/*      //up arrow
      case 38: if (this.camera.position.z > 15){ this.camera.position.z-=15; this.camera.position.x-=15; } break;
      case 87: if (this.camera.position.z > 50) {this.camera.position.z-=50; } break;
      //right arrow
      case 39: if (this.camera.position.z > 15){this.camera.position.x+=15; this.camera.position.z-=15; } break;
      case 68: if (this.camera.position.x >= 25){this.camera.position.x-=25; } break;
      //down arrow
      case 40: this.camera.position.z+=15; this.camera.position.x+=15; break;
      case 83: this.camera.position.z+=50; break;
     */ 
      case 16: isShiftDown = true; break
      case 17: isCtrlDown = true; break
      case 18: isAltDown = true; break
      
      //firefox zoom
      case 173: zoom(100); break
      case 61: zoom(-100); break
      default: console.log(event.keyCode)
    }

  }

  function onDocumentKeyUp( event ) {

    switch( event.keyCode ) {

      case 16: isShiftDown = false; break
      case 17: isCtrlDown = false; break
      case 18: isAltDown = false; break

    }
  }
}