MineZone = function(low, rotation){
	// this.relativeZone = [[-1,0],[0,1],[1,1],[0,-1],[1,-1],[2,0]];
	this.low = low;
	this.rotation = rotation;
	this.lol = undefined;
	this.absolutePositions = undefined;

	if (low && rotation){
		this.lol = [this.low[0]+this.rotation[0], this.low[1]+this.rotation[1]];
	}

	if (low && rotation){
		this.absolutePositions = 	[[this.low[0]+1,this.low[1]], [this.low[0]-1,this.low[1]], [this.low[0],this.low[1]-1], [this.low[0],this.low[1]+1],
									 [this.lol[0]+1,this.lol[1]], [this.lol[0]-1,this.lol[1]], [this.lol[0],this.lol[1]-1], [this.lol[0],this.lol[1]+1]
									];
	}


	this.isInside = function(square){
		var high = [this.low[0]+this.rotation[0], this.low[1]+this.rotation[1]];
		var lowChange = Math.abs(this.low[0]-square[0]) + Math.abs(this.low[1]-square[1]);
		var highChange = Math.abs(high[0]-square[0])+ Math.abs(high[1]-square[1]);
		console.log(this.low);
		console.log(this.rotation);
		console.log(lowChange);
		console.log(highChange);
		return (lowChange <=1 || highChange <=1);
	}


}