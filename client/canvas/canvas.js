Canvas = function(){

  this.container;
  this.camera;
  this.renderer; 
  this.pointerDetectRay;
  this.projector, this.plane, this.scene;
  this.mouse2D, this.mouse3D, this.raycaster, this.objectHovered;
  this.isMouseDown = false;
  this.onMouseDownPosition = new THREE.Vector2(), this.onMouseDownPhi = 0 , this.onMouseDownTheta = 0;
  this.radius = 2500, this.theta = 0, this.phi = 0;
  this.cameraTarget = new THREE.Vector3( 0, 0, 0 );
  this.ships = new THREE.Object3D();
  this.shipDictionary;
  this.corals = new THREE.Object3D(); 
  this.water ;
  this.directionalLight;
  this.controls;


  this.coralArray;
  this.VisibilityBoxes = []; 

  this.objectHovered;
  this.FURTHEST = 4500;
  this.CLOSEST = 500;
  this.RENDER_HEIGHT = window.innerHeight; 
  this.RENDER_WIDTH = window.innerWidth;
  this.directionVector = new THREE.Vector3(); 

//  drawCanvas();
  this.drawCanvas = function(aMap) {
    console.log('drawing canvas');
    this.shipDictionary = aMap.shipDictionary;
    this.coralArray = aMap.grid.coralSpots;
    this.camera = new THREE.PerspectiveCamera(55.0, this.RENDER_WIDTH / this.RENDER_HEIGHT, 0.5, 3000000);
    this.camera.position.set(1000, 500, -1500);

    this.scene = new THREE.Scene();

    // Grid
    var squares = 25;

    var line = new THREE.GridHelper(squares*15, squares);
    line.position = new THREE.Vector3(0,13,0);
    var material = new THREE.LineBasicMaterial( { color: 0x191970, linewidth: 2 } );
    line.material = material;//.color.setHex(0x191970);
//    line.type = THREE.LinePieces;
    line.name = 'grid';
    this.scene.add(line);

//0x4169E1
    // Plane
    aPlaneGeometry = new THREE.CubeGeometry( 27, 27, 52);
    aPlaneMaterial = new THREE.MeshPhongMaterial({color: 0x3366CC, ambient:0x4169E1, shininess: 77}); 

    var seaPlane = new THREE.Mesh(new THREE.CubeGeometry( 750, 750, 25), new THREE.MeshBasicMaterial({color:0x4169E1, wireframe:false, opacity: 1}));
    seaPlane.rotation.x = - Math.PI / 2;
    //this.scene.add(seaPlane);


    this.plane = new THREE.Object3D();
    var aPlane = new THREE.Mesh( aPlaneGeometry, aPlaneMaterial);
    aPlane.position.x =-25*14-12.5;
    aPlane.position.y = 0;
    aPlane.position.z =-25*14-12.5;
    aPlane.rotation.x = - Math.PI / 2;

    for (i=0;i<30;i++){
      for (j=0;j<30;j++){
        var somePlane = aPlane.clone();
        somePlane.position.x += i*25;
        somePlane.position.z += j*25;
        this.plane.add(somePlane); 
      }
    }
    this.plane.name = 'plane';
    //this.scene.add(this.plane);

    this.raycaster = new THREE.Raycaster(); 
    this.raycaster.ray.direction.set( 0,0,0); 
    this.projector = new THREE.Projector();
    this.mouse2D = new THREE.Vector3( 0, 0, 0 );

    //addCorals
    this.addCorals(this.coralArray);

    //addShips
    this.addShips(this.shipDictionary);

    this.setVisibleFromName(aMap);

    this.loadSkyBox();


    var someCanvas = document.getElementById('myCanvas');
    this.renderer = new THREE.WebGLRenderer({ canvas: someCanvas});
    this.renderer.setSize( this.RENDER_WIDTH-40, this.RENDER_HEIGHT-180-5);
    this.render();
}

  this.addShips = function(shipDictionary){
    for (ship in shipDictionary){
      var s = new Ship3D();
      s.fromShip(shipDictionary[ship]);
      s.ship.shipInfo = shipDictionary[ship];
      this.ships.add(s.ship);
    }
    this.ships.name = 'ships';
    this.scene.add(this.ships);
  }

  this.addCorals = function(coralArray){
    for (var i=0; i < coralArray.length;i++){
      var c = new coral3D(coralArray[i][1],coralArray[i][0] )
      this.corals.add(c.coral);
    }
    this.corals.name = 'corals';
    this.scene.add(this.corals);

  }

  this.zoom = function(delta) {
    var origin = {x: 0, y: 0, z: 0}
    var distance = this.camera.position.distanceTo(origin)
    var tooFar = distance  > FURTHEST
    var tooClose = distance < CLOSEST
    if (delta > 0 && tooFar) return
    if (delta < 0 && tooClose) return
   //this.radius = distance // for mouse drag calculations to be correct
    this.camera.translateZ( delta)
    this.render()

  }
  this.render = function() {
        this.camera.lookAt( this.cameraTarget );
        this.raycaster = this.projector.pickingRay( this.mouse2D.clone(), this.camera )
        this.renderer.render( this.scene, this.camera );
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

  this.translateShip = function(name,x,z){
    if(x)
      this.getShip(name).translateX(x);
    if(z)
      this.getShip(name).translateZ(z);
    this.render();
  }

  this.getShip = function(shipName){
    return this.ships.getObjectByName(shipName);//this.ships;
  }

  this.getIntersecting = function() {
   // this.raycaster = this.projector.pickingRay( this.mouse2D.clone(), this.camera )
    var intersections = this.raycaster.intersectObjects( this.ships.children, true )
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

      this.objectHovered = null;
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

  this.moveShip = function(aShip) {
    if (typeof this.raycaster === 'undefined') return
      var orientation = aShip.orientation;
      this.directionVector.setX(orientation[1]); 
      this.directionVector.setZ(orientation[0]);
      this.getShip(aShip.id).translateOnAxis(this.directionVector,25);
  }

  this.rotateShip= function(aShip, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    var aShip3D = this.getShip(aShip.id);
    console.log(aShip3D);
    aShip3D.matrix.multiply(rotObjectMatrix);
    aShip3D.rotation.setEulerFromRotationMatrix(aShip3D.matrix);
  }

  this.setShipVisible = function(object, bool){
    object.traverse (function(node){if (node){node.visible = bool}})
  }

  this.setVisible = function(x,y, bool){
    if (x+30*y >0 && x+30*y < 900)
    this.plane.children[x+30*y].visible = bool;
  }

  this.setPlaneVisible = function(a, bool){
    this.plane.children[a[0]+30*a[1]].visible = !bool;
  }

  this.setVisibleFromName = function(m){
    var visible = m.getVisibleSquares('challenger');
    for (square in visible){
      this.setPlaneVisible(JSON.parse(square), visible[square]);
    }
  }


//EXTERNAL CODE!!!!
  this.loadSkyBox = function() {
    var aCubeMap = THREE.ImageUtils.loadTextureCube([
      'img/px.jpg',
      'img/nx.jpg',
      'img/py.jpg',
      'img/ny.jpg',
      'img/pz.jpg',
      'img/nz.jpg'
    ]);
    aCubeMap.format = THREE.RGBFormat;

    var aShader = THREE.ShaderLib['cube'];
    aShader.uniforms['tCube'].value = aCubeMap;

    var aSkyBoxMaterial = new THREE.ShaderMaterial({
      fragmentShader: aShader.fragmentShader,
      vertexShader: aShader.vertexShader,
      uniforms: aShader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });

    var aSkybox = new THREE.Mesh(
      new THREE.CubeGeometry(1000000, 1000000, 1000000),
      aSkyBoxMaterial
    );
    aSkybox.name = 'skybox';

    this.scene.add(aSkybox);
  }

  this.loadWater = function(){
    //Add light
    this.directionalLight = new THREE.DirectionalLight(0xffff55, 1);
    this.directionalLight.position.set(-600, 300, 600); 
    this.directionalLight.name = 'light';
    this.scene.add(this.directionalLight);

    // Load textures    
    var waterNormals = new THREE.ImageUtils.loadTexture('waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 

    // Create the water effect
    this.water = new THREE.Water(this.renderer, this.camera, this.scene, {
      textureWidth: 256,
      textureHeight: 256,
      waterNormals: waterNormals,
      alpha:  1.0,
      sunDirection: this.directionalLight.position.normalize(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      betaVersion: 0
    });
    //this.water.position.y +=5;

    var aMeshMirror = new THREE.Mesh(
      new THREE.PlaneGeometry(1000000, 1000000, 100, 100), 
      this.water.material
    );
    aMeshMirror.add(this.water);
    aMeshMirror.rotation.x = - Math.PI * 0.5;
    aMeshMirror.name = 'mirror';

    this.scene.add(aMeshMirror);
  }


  this.loadClouds = function(){
    var geometry = new THREE.Geometry();

    var texture = THREE.ImageUtils.loadTexture( 'cloud10.png', null, mainLoop );
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    //texture.minFilter = THREE.LinearMipMapLinearFilter;
    
    var fog = new THREE.Fog( 0x4584b4, 0, 3000 );

    var material = new THREE.ShaderMaterial( {

      uniforms: {

        "map": { type: "t", value: texture }, 
        "fogColor" : { type: "c", value: fog.color },
        "fogNear" : { type: "f", value: fog.near },
        "fogFar" : { type: "f", value: fog.far },

      },
      vertexShader: document.getElementById( 'vs' ).textContent,
      fragmentShader: document.getElementById( 'fs' ).textContent,
      depthWrite: false, 
      depthTest: false,
      transparent: true

    } );

    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 27, 27) );
    // var max = 25*14-12.5- 700;
    // var min = 25*14-12.5-725;  
    for (var j=0; j< 1500; j++){
//      for ( var i = 0; i < 9; i++ ) {
          plane.position.x = Math.random() * 1000 - 500;
          plane.position.y = Math.random() * 1000 - 500;
          plane.position.z = j;
          plane.rotation.z = Math.random() * Math.PI;
          plane.scale.x = plane.scale.y = Math.random() * Math.random() * 10 + 0.5;
        THREE.GeometryUtils.merge( geometry, plane );
 //     }
    }

    var mesh = new THREE.Mesh( geometry, material );
    this.scene.add( mesh );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.z = - 8000;
    this.scene.add( mesh );
  }

  this.displayThing = function() {
    //this.water.render();
    //this.renderer.render(this.scene, this.camera);
    this.render();
  }

  this.updateThing = function() {
    this.water.material.uniforms.time.value += 1.0 / 60.0;
    this.displayThing();
  }

}
