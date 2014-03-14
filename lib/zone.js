Zone = function(direction, size, start) {

var flip = function(u){  
	return [u[1],u[0]];
}
var dotmultiply = function(u, v){
	return [u[0] * v[0], u[1] * v[1]];
}

var sum = function(u,v){
	return [u[0] + v[0], u[1] + v[1]];
}

//enumerate makes a tuple for every square in the zone

var enumerateSquares = function(zone) {

	var topLeft = zone[0];
	var bottomRight = zone[0];
	var zoneSquares = [];

	//determine the top left and bottom right of the zone

	for(var i = 0; i <4; i++){
		if (zone[i][0] <= topLeft[0] && zone[i][1] >= topLeft[1])
			topLeft = zone[i];
			
		if (zone[i][0] >= bottomRight[0] && zone[i][1] <= bottomRight[1])
			bottomRight = zone[i];
	}
	//create a tuple (x,y) for each square between the top left and bottom right

	console.log(topLeft);
	console.log(bottomRight);

	var count = 1;
	for(var i = topLeft[0]; i < bottomRight[0]; i++ ){
		for(var j = topLeft[1]; j > bottomRight[1]; j--){
			zoneSquares.push([i,j]);
		}
	}
	return zoneSquares;
}

	
	var odirection = flip(direction);
	//now we can create the zone, which is defined by 4 absolute points
	var a = start;
	var b = sum(dotmultiply(odirection, size), start);
	var c = sum(dotmultiply(direction,size), b);
	var d = sum(dotmultiply(direction, size), start);

	//This gives a rectangle with abcd
	this.zone = [a, b, c, d];
	this.zoneSquares = enumerateSquares(this.zone);

}