Ship3D = function Ship3D(){
	this.ship = new THREE.Object3D();
	this.vector = new THREE.Vector3();
	this.visibleBox = new THREE.Box2();

	this.fromShip  = function(aShip){
		
		//set position
		this.vector.setX(aShip.sternPosition[1]*25 -25*14-12.5);
		this.vector.setZ(aShip.sternPosition[0]*25 -25*14-12.5);
		this.ship.position = this.vector;

		//set visible box:
		var vivi = 2;
		this.visibleBox.set(new THREE.Vector2(aShip.sternPosition[1]-25*vivi,aShip.sternPosition[1]), 
							new THREE.Vector2(aShip.sternPosition[1]+25*vivi,aShip.sternPosition[1]+25*aShip.shipLength));

		//for the length of the ship, add 'cubes'
		//keep in mind the orientation of the ship
        for (i=0;i<aShip.shipLength;i++){
	        	var aCube;
				if(aShip.id.indexOf('base') != -1){
			        aCube = new Brush(i*aShip.orientation[0],i*aShip.orientation[1], 15, 25,25);
			        if (aShip.owner == 'challenger')
				        aCube.changeColor(0x280000); 
				    else
				        aCube.changeColor(0x00008B); 
			    }
			    else{
			        aCube = new Brush(i*aShip.orientation[0],i*aShip.orientation[1]);
			        //color the front bow of the ship
			        if(aShip.owner == 'opponent'){
			        	if (i == aShip.shipLength-1){
				        	aCube.changeColor(0xFFFF00);
				    	}
						else{
				        	aCube.changeColor(0x1E90FF);
						}
					}
					else{
			        	if (i == aShip.shipLength-1){
				        	aCube.changeColor(0xFF0000);
				    	}
					}
				 }
		        this.ship.add(aCube.brush);
		}

		this.ship.name = aShip.id;
	}
}