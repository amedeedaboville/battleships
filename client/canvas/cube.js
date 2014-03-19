Cube = function Cube(z, x, cubeX, cubeY, cubeZ){
    var cubeSizes;
    if (cubeX){
        var cubeSizes = [cubeX, cubeY, cubeZ];
    }
    else
        var cubeSizes = [25,25,15];

    var cube = new THREE.CubeGeometry( cubeSizes[0], cubeSizes[1], cubeSizes[2], 1, 1, 1  ) ;
    var cubeMaterials = [
      new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 2 } ),
      new THREE.MeshBasicMaterial( { color: 0xb22222, vertexColors: THREE.NoColors, wireframe: false, wireframeLinewidth: 4 } )
    ]
        this.cube = THREE.SceneUtils.createMultiMaterialObject( cube, cubeMaterials );
        this.cube.iscube = true
        this.cube.overdraw = true
        this.cube.position.x = x*25;
        this.cube.position.y = 12.5;
        this.cube.position.z = z*25;
        
        this.changeColor = function(color){
            this.cube.children[1].material.color.setHex(color);
        }

        this.fixPosition = function(){
            this.cube.position.x += -25*14-12.5;
            this.cube.position.z += -25*14-12.5;
        }
    }

