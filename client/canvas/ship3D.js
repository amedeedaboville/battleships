Ship3D = function Ship3D(shipStartx, shipStartz, shipLength, name, orientation){
	this.ship = new THREE.Object3D();
	this.createShip  = function(){

		//for the length of the ship, add 'cubes'
		//keep in mind the orientation of the ship
        for (i=0;i<shipLength;i++){
	        	var aCube;
				if(name == 'Base'){
			        aCube = new Brush(shipStartz+i*orientation[0],shipStartx+i*orientation[1], 15, 25,25);
			        aCube.changeColor(0xFFFFFF);
			    }
			    else{
			        aCube = new Brush(shipStartz+i*orientation[0],shipStartx+i*orientation[1]);
			        //color the front bow of the ship
			        if(i== shipLength-1){
			        aCube.changeColor(0xFFFFFF);
			    }
			    }
		        this.ship.add(aCube.brush);
		}

		this.ship.name = name;
	}

	this.moveShip = function(x,y){
		this.ship.translateX(x);
		this.ship.translateZ(y);
		// for (e in this.ship.children){

		// }
	}

}