Ship3D = function Ship3D(shipStartx, shipStartz, shipLength){
	this.ship = new THREE.Object3D();
	this.createShip  = function(){
        for (j=0;j<shipLength;j++){
	        var aBrush = new Brush(shipStartz,j+shipStartx);
	        if(j==0){
	            aBrush.changeColor(0xFFA500);
	        }
	        this.ship.add(aBrush.brush);
	    }
	}

}