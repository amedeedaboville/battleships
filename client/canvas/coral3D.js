coral3D = function coral3D(coralStartx, coralStartz){
	this.coral = new THREE.Object3D();

	this.createCoral = function(){
		var coralCube = new Brush(coralStartz,coralStartx, 25, 25,25, 0xFFC0CB);
		coralCube.fixPosition();
        coralCube.changeColor(0xE9967A); 
	
		this.coral.add(coralCube.brush);
		this.coral.name = 'coral';
	}
	this.createCoral();
}