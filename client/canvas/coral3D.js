coral3D = function coral3D(coralStartx, coralStartz){
	this.coral = new THREE.Object3D();

	this.createCoral = function(){
		var coralCube = new Cube(coralStartz,coralStartx, 25, 29,25, 0xFFC0CB);
		coralCube.fixPosition();
        coralCube.changeColor(0xE9967A); 
	
		this.coral.add(coralCube.cube);
		this.coral.name = 'coral';
	}
	this.createCoral();
}