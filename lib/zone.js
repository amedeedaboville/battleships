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

    var difference = function(u,v){
        return [u[0] - v[0], u[1] - v[1]];
    }

    //enumerate makes a tuple for every square in the zone

    this.enumerateSquares = function() {

        var topLeft = this.zone[0];
        var bottomRight = this.zone[0];
        var zoneSquares = [];
        //determine the top left and bottom right of the zone

        for(var i = 0; i <4; i++){
            if (this.zone[i][0] <= topLeft[0] && this.zone[i][1] <= topLeft[1]) {
                topLeft = this.zone[i];
            }
            if (this.zone[i][0] >= bottomRight[0] && this.zone[i][1] >= bottomRight[1]){
                bottomRight = this.zone[i];
            }
        }
        //create a tuple (x,y) for each square between the top left and bottom right

        for(var i = topLeft[0]; i <= bottomRight[0]; i++ ){
            for(var j = topLeft[1]; j <= bottomRight[1]; j++){
                //j and i are reversed to make it row/col instead of cartesian
                zoneSquares.push([j, i]);
            }
        }
        return zoneSquares;
    }

    //flip start because 1 am night before

    var dir = flip(direction);
    var st = flip(start);

    var d = (size[1]-1)/2 ; 
    var negativeTranspose = difference([0,0], flip(dir));
    var xVector = dotmultiply(negativeTranspose, [d,d]) ;
    var yVector = dotmultiply(dir, [size[0], size[0]]) ;
    var odirection = flip(dir);
    //now we can create the zone, which is defined by 4 absolute points


    var a = sum(st, xVector);
    var b = (sum(a, yVector));
    var d = (difference(st, xVector));
    var c = (sum(d, yVector));

    //This gives a rectangle with abcd
    this.zone = [a, b, c, d];
    this.zoneSquares = this.enumerateSquares();

    //AT this point, a,b,c,d are in x,y cartesian form. All we need to do is flip the values of the enumerated squares into row/col coordinates!!!
}



