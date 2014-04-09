getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Map = function() {
    this.squares = [];
    this.coralSpots = [];
    this.mineSpots = {};
    this.mineHotZoneSpots = [];
    this.shipDictionary = {};
    this.visibleCoordinatesChallenger = [];
    this.visibleCoordinatesOpponent = [];
    this.deployedMines = [];

    this.sign = function(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    };

    /******************Draw methods*************************/
    this.chooseCorals = function() {
        while(this.coralSpots.length < 24) {
            var newSpot = [getRandomInt(3,26), getRandomInt(10,20)];
            var spotAlreadyPicked = false;
            for(var i = 0; i < this.coralSpots.length; i++) {
                if(this.coralSpots[i][0] == newSpot[0] && this.coralSpots[i][1] == newSpot[1]) {
                    spotAlreadyPicked  = true;
                    break;
                }
            }
            if (!spotAlreadyPicked) {
                this.coralSpots.push(newSpot);
                this.squares[newSpot[0]][newSpot[1]] = new coralSquare(newSpot[0], newSpot[1]);
            }
        }
    }

    this.drawGrid = function() {
        this.squares = [];
        for(var i = 0; i < 30; i++) {
            this.squares[i] = [];
            for(var j = 0; j < 30; j++) {
                this.squares[i][j] = new seaSquare(i,j);
            }
        }
        if(this.coralSpots.length == 0) {
            this.chooseCorals();
        }

        this.coralSpots.forEach(function(pos) {
            this.squares[pos[0]][pos[1]] = new coralSquare(pos[0], pos[1]);
        }.bind(this));

        for(pos in this.mineSpots){
            var square = this.mineSpots[pos];
            if (square && square.position){
                square = this.mineSpots[pos].position;
                this.squares[square[0]][square[1]].mine = this.mineSpots[square];
                this.squares[square[0]+1][square[1]].mineHotZone = this.mineSpots[square];
                this.squares[square[0]-1][square[1]].mineHotZone = this.mineSpots[square];
                this.squares[square[0]][square[1]+1].mineHotZone = this.mineSpots[square];
                this.squares[square[0]][square[1]-1].mineHotZone = this.mineSpots[square];
            }
        }

        this.drawShips();
    };

    this.drawShips = function(){
        for(ship in this.shipDictionary) {
            this.drawShip(this.shipDictionary[ship]);
        }
    }

    //from a ship, update squares
    this.drawShip = function(ship){
        ship.shipSquares.forEach(function(square) {
            var x = square.position[0];
            var y = square.position[1];
            this.squares[x][y] = square;
        }.bind(this));
    }

    //from squares, update ship
    this.drawShipFromSquare = function(ship){
        this.shipDictionary[ship.id].shipSquares.forEach(function(square) {
            var x = square.position[0];
            var y = square.position[1];
            this.squares[x][y] = square;
        }.bind(this));
    }


    /***************************Ship methods******************/
    this.makeShips = function(rand, challenger, opponent) {
        console.log("in make ships");

         //functionality for randomizing the creation of ships

         var chalpos =  [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
         var oppos = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

        if (rand){
            if (challenger){
                var chalpos = shuffle(chalpos);

                //var requiredShips = ["cruiser1", "cruiser2", "destroyer1", "destroyer2", "radar1", "radar2"];
                this.shipDictionary["cruiser1"] = new Cruiser([chalpos[0],1], "cruiser1", "challenger");
                this.shipDictionary["cruiser2"] = new Cruiser([chalpos[1],1], "cruiser2", "challenger");
                this.shipDictionary["destroyer1"] = new Destroyer([chalpos[2],1], "destroyer1", "challenger");
                this.shipDictionary["destroyer2"] = new Destroyer([chalpos[3],1], "destroyer2", "challenger");
                this.shipDictionary["destroyer3"] = new Destroyer([chalpos[4],1], "destroyer3", "challenger");
                this.shipDictionary["minelayer1"] = new MineLayer([chalpos[5],1], "minelayer1", "challenger");
                this.shipDictionary["minelayer2"] = new MineLayer([chalpos[6],1], "minelayer2", "challenger");
                this.shipDictionary["torpedo1"] = new Torpedo([chalpos[7],1], "torpedo1", "challenger");
                this.shipDictionary["torpedo2"] = new Torpedo([chalpos[8],1], "torpedo2", "challenger");
                this.shipDictionary["radar1"] = new Radar([chalpos[9],1 ], "radar1", "challenger");
                this.shipDictionary["kamikaze1"] = new Kamikaze([chalpos[10],1], "kamikaze1", "challenger");
               
            }
            if (opponent){
                var oppos = shuffle(oppos);
                
                this.shipDictionary["cruiser3"] = new Cruiser([oppos[0],28], "cruiser3", "opponent", [0,-1]);
                this.shipDictionary["cruiser4"] = new Cruiser([oppos[1],28], "cruiser4", "opponent", [0,-1]);
                this.shipDictionary["destroyer4"] = new Destroyer([oppos[2],28], "destroyer4", "opponent", [0,-1]);
                this.shipDictionary["destroyer5"] = new Destroyer([oppos[3],28], "destroyer5", "opponent", [0,-1]);
                this.shipDictionary["destroyer6"] = new Destroyer([oppos[4],28], "destroyer6", "opponent", [0,-1]);
                this.shipDictionary["minelayer3"] = new MineLayer([oppos[5],28], "minelayer3", "opponent", [0,-1]);
                this.shipDictionary["minelayer4"] = new MineLayer([oppos[6],28], "minelayer4", "opponent", [0,-1]);
                this.shipDictionary["torpedo3"] = new Torpedo([oppos[7],28], "torpedo3", "opponent", [0,-1]);
                this.shipDictionary["torpedo4"] = new Torpedo([oppos[8],28], "torpedo4", "opponent", [0,-1]);
                this.shipDictionary["radar2"] = new Radar([oppos[9],28], "radar2", "opponent", [0,-1]);

            }
        } else {

       
        //var requiredShips = ["cruiser1", "cruiser2", "destroyer1", "destroyer2", "radar1", "radar2"];
        this.shipDictionary["cruiser1"] = new Cruiser([chalpos[0],1], "cruiser1", "challenger");
        this.shipDictionary["cruiser2"] = new Cruiser([chalpos[1],1], "cruiser2", "challenger");
        this.shipDictionary["destroyer1"] = new Destroyer([chalpos[2],1], "destroyer1", "challenger");
        this.shipDictionary["destroyer2"] = new Destroyer([chalpos[3],1], "destroyer2", "challenger");
        this.shipDictionary["destroyer3"] = new Destroyer([chalpos[4],1], "destroyer3", "challenger");
        this.shipDictionary["minelayer1"] = new MineLayer([chalpos[5],1], "minelayer1", "challenger");
        this.shipDictionary["minelayer2"] = new MineLayer([chalpos[6],1], "minelayer2", "challenger");
        this.shipDictionary["torpedo1"] = new Torpedo([chalpos[7],1], "torpedo1", "challenger");
        this.shipDictionary["torpedo2"] = new Torpedo([chalpos[8],1], "torpedo2", "challenger");
        this.shipDictionary["radar1"] = new Radar([chalpos[9],1], "radar1", "challenger");
        this.shipDictionary["kamikaze1"] = new Kamikaze([chalpos[10],1], "kamikaze1", "challenger");

        

        this.shipDictionary['base1'] = new Base([10,0], "base1", "challenger");

        this.shipDictionary["cruiser3"] = new Cruiser([oppos[0],28], "cruiser3", "opponent", [0,-1]);
        this.shipDictionary["cruiser4"] = new Cruiser([oppos[1],28], "cruiser4", "opponent", [0,-1]);
        this.shipDictionary["destroyer4"] = new Destroyer([oppos[2],28], "destroyer4", "opponent", [0,-1]);
        this.shipDictionary["destroyer5"] = new Destroyer([oppos[3],28], "destroyer5", "opponent", [0,-1]);
        this.shipDictionary["destroyer6"] = new Destroyer([oppos[4],28], "destroyer6", "opponent", [0,-1]);
        this.shipDictionary["minelayer3"] = new MineLayer([oppos[5],28], "minelayer3", "opponent", [0,-1]);
        this.shipDictionary["minelayer4"] = new MineLayer([oppos[6],28], "minelayer4", "opponent", [0,-1]);
        this.shipDictionary["torpedo3"] = new Torpedo([oppos[7],28], "torpedo3", "opponent", [0,-1]);
        this.shipDictionary["torpedo4"] = new Torpedo([oppos[8],28], "torpedo4", "opponent", [0,-1]);
        this.shipDictionary["radar2"] = new Radar([oppos[9],28], "radar2", "opponent", [0,-1]);
//        this.shipDictionary["kamikaze2"] = new Kamikaze([oppos[10],28], "kamikaze2", "opponent");

        this.shipDictionary['base2'] = new Base([10,29], "base2", "opponent");

        }


    };

    this.getShips = function() {
        return this.shipDictionary; 
    };

    this.killShip = function(ship) {
        console.log("Ship "+ship.id +" killed >:) ");
        for (var i = 0; i < ship.shipSquares.length; i++) {
            delete ship.shipSquares[i];
        }
        delete this.shipDictionary[ship.id];
    }

    /*******************Grid Methods*********************/
    this.getSquares = function() {
        return this.squares;
    };

    this.getGrid = function(player) {
        if(Object.keys(this.shipDictionary).length == 0) { return;}
        var newGrid = [];
        var vis = this.getVisibleSquares(player);
        var visMine = this.getVisibleMines(player);
        for(var r = 0; r < 30; r++) {
            newGrid[r] = [];
            for(var c = 0; c < 30; c++) {
                var key = '[' + r + ',' + c + ']';
                if(vis[key] == true) {
                    newGrid[r][c] = this.squares[r][c];
                    newGrid[r][c].__proto__ = new Square(r,c);
                    newGrid[r][c].setVisible(true);
                    if(visMine[key] == true) {
                        console.log('showing some mine');
                        console.log([r,c]);
                        newGrid[r][c] = this.squares[r][c].mine;
                        newGrid[r][c].__proto__ = new Square(r,c);
                        newGrid[r][c].setVisible(true);
                    }
                }
                else {
                    newGrid[r][c] = new seaSquare(r,c);
                    //console.log(newGrid[r][c]);
                }
            }
        }
        return newGrid;
    };

    this.getVisibleMines = function(player) {
        var visibleMinesPos = {}; 
        for (ship in this.shipDictionary){
            if (this.shipDictionary[ship].owner == player){          
                var visibleMines = this.shipDictionary[ship].mineZone;
                if (visibleMines && visibleMines.absolutePositions){
                    for (var i = 0; i < visibleMines.absolutePositions.length; i++) {
                        if (this.getSquareAtPosition(visibleMines.absolutePositions[i]).mine){
                            visibleMinesPos[JSON.stringify(visibleMines.absolutePositions[i])] = true;
                        }
                    };
                }
            }
        };

        return visibleMinesPos; 

    };

   
    this.getVisibleSquares = function(player) {
        var visibleSquares = {}; 
        for (ship in this.shipDictionary){
            if (this.shipDictionary[ship].owner == player){          
                var visiblePositions = this.shipDictionary[ship].radarSquares;
                visiblePositions.forEach(function(pos) { visibleSquares[JSON.stringify(pos)] = true; });
            }   

            for (shipID in this.shipDictionary) {
                var ship = this.shipDictionary[shipID];
                if (ship.owner == player || ship.name == "Base"){
                    for(var i = 0; i < ship.shipLength; i++) {
                        var square = ship.shipSquares[i];
                        visibleSquares[JSON.stringify(square.position)] = true;
                    }
                }
            }
            if(player === 'challenger') {
                visibleSquares['[9,0]'] = true;
                visibleSquares['[20,0]'] = true;
            }
            if(player === 'opponent') {
                visibleSquares['[9,29]'] = true;
                visibleSquares['[20,29]'] = true;
            }
            for (var i = 10; i < 20; i++) {
                if(player === 'challenger')
                    visibleSquares['[' + i +',1]'] = true;
                if(player === 'opponent')
                    visibleSquares['[' + i +',28]'] = true;
            }

            for (var i = 0; i < 24; i++) {
                var spot = this.coralSpots[i];
                visibleSquares[JSON.stringify(spot)] = true;
            }
        }

        return visibleSquares; 
    }

    this.getDistanceBetween = function(p1, p2) {
        return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
    };

    this.getSquareAtPosition = function(position) {
        return this.squares[position[0]][position[1]];
    }

    /*******************Vector methods*************************/
    this.makeDisplacementVector = function (startPosition, endPosition){
        var displacementVector = [endPosition[0] - startPosition[0], endPosition[1] - startPosition[1]];
        return displacementVector;
    }

    this.normalize = function (vector){
        var normalized = [this.sign(vector[0]), this.sign(vector[1])];
        return normalized;
    }

    /****************** Collision methods ******************/

    this.getClosestObjectForward = function(start, movementVector, onlyMine){
        var nVector = this.normalize(movementVector);

        //check from closest to farthest away
        for (var i = 1; i <= Math.abs(movementVector[0] + movementVector[1]); i++) {
            var obj = this.getSquareAtPosition([start[0]+i*nVector[0], start[1]+i*nVector[1]]);
            if (obj.name != "sea"){
                return [i-1, obj];
            }

            else if (obj.mineHotZone && !onlyMine){
                return [i, obj];
            }

            else if (obj.mine){
                return [i-1, obj];
            }
        };
        return [i-1, undefined];
    }

    this.getClosestObjectSideways = function(ship, startPosition){
        for (var i = 0; i < ship.shipLength; i++) {
            var x = startPosition[0] +i*ship.orientation[0];
            var y = startPosition[1] +i*ship.orientation[1];
            //console.log(x +"," + y);
            var obj = this.getSquareAtPosition([x,y]);
            if (obj.name != "sea" || obj.mine || obj.mineHotZone){
                return obj;//0
            }
        };
        return undefined;
    }

    this.getObjectTurning = function(squareArray){
        for (var i = 0; i < squareArray.length; i++) {
            var obj = this.getSquareAtPosition([squareArray[i][0],squareArray[i][1]]);
            if (obj.name != "sea" || obj.mine || obj.mineHotZone){
                return obj;
            }
        };
        return undefined;
    }
    /********************Movement methods*******************/

    //Usage: moveShip(Ship ship, Position endPosition, String CARDINAL_DIRECTION))
    this.moveShip = function(ship, endPosition){

        ship.__proto__ = new Ship();
        if (ship.name == "Kamikaze") {
            ship.__proto__ = new Ship();
           var dest = this.getSquareAtPosition(endPosition);
           if (dest.name == "sea") {
               ship.bruteMove(endPosition);
           } else if (dest.name = "mine") {
              this.explodeMine(endPosition);
           }
           this.redrawShip(ship);
           
           return;
        }

        //initialize the movementVector
        var movementVector = this.makeDisplacementVector(ship.bowPosition,endPosition);
        var normalizedMovementVector = this.normalize(movementVector);

        //movement is forward
        if (normalizedMovementVector[0] == ship.orientation[0] && normalizedMovementVector[1] == ship.orientation[1]){
            //find closest object to our ship
            var closestObject = this.getClosestObjectForward(ship.bowPosition, movementVector, false); 
            var movement = closestObject[0];
            movement = Math.min(movement, ship.speed);

            //tell the ship to move itself!
            ship.moveStraight(movement);
            this.redrawShip(ship);
        
            //if it collides with a mine... interact
            if (closestObject[1] && closestObject[1].mine && ship.name != "Mine Layer"){
                this.explodeMine(closestObject[1].position);
                this.redrawShip(ship);
            }
            else if (closestObject[1] && closestObject[1].mineHotZone && ship.name != "Mine Layer"){
                this.explodeMine(closestObject[1].mineHotZone.position);
                this.redrawShip(ship);
            }
        }

        //movement is backward
        else if (normalizedMovementVector[0] == -ship.orientation[0] && normalizedMovementVector[1] == -ship.orientation[1]){
            //console.log('>>> moving backwards')

            //find closest object to our ship
            var obj = this.getSquareAtPosition([ship.sternPosition[0]+normalizedMovementVector[0], 
                                                ship.sternPosition[1]+normalizedMovementVector[1]]);
            if (obj.name == "sea"){
                //if they can back up, back up 1
                ship.moveStraight(-1);
                this.redrawShip(ship);//maybe at the end?

                if(obj.mine && ship.name != "Mine Layer"){
                    this.explodeMine(obj.position);
                    this.redrawShip(ship);
                }

                else if(obj.mineHotZone  && ship.name != "Mine Layer"){
                    this.explodeMine(obj.mineHotZone.position);
                    this.redrawShip(ship);
                }
            }
        }

        //movement is sideways
        else {

            if (ship.orientation[0] == 0){

                //check positions
                var startPosition = [ship.sternPosition[0] + normalizedMovementVector[0], ship.sternPosition[1]];
                var movement = this.getClosestObjectSideways(ship, startPosition);

                if(!movement){
                    ship.moveSideways(normalizedMovementVector[0]);
                }

                else if (movement.mine  && ship.name != "Mine Layer"){
                    ship.moveSideways(normalizedMovementVector[0]);
                    this.redrawShip(ship);
                    this.explodeMine(movement.position);
                }
                else if (movement.mineHotZone  && ship.name != "Mine Layer"){
                    ship.moveSideways(normalizedMovementVector[0]);
                        this.redrawShip(ship);
                        this.explodeMine(movement.mineHotZone.position);
                }
            }

            else if (ship.orientation[1] == 0){

                var startPosition = [ship.sternPosition[0], ship.sternPosition[1] + normalizedMovementVector[1]];
                var movement = this.getClosestObjectSideways(ship, startPosition);

                if(!movement){
                    ship.moveSideways(normalizedMovementVector[1]);
                }

                else if (movement.mine  && ship.name != "Mine Layer"){
                    ship.moveSideways(normalizedMovementVector[1]);
            this.redrawShip(ship);
                    this.explodeMine(movement.position);
                }

                else if (movement.mineHotZone  && ship.name != "Mine Layer"){
                    ship.moveSideways(normalizedMovementVector[1]);
                    this.redrawShip(ship);
                    this.explodeMine(movement.mineHotZone.position);
                }
            }

            this.redrawShip(ship);
        }
    };

    this.redrawShip = function(ship){
        this.shipDictionary[ship.id] = ship;
        this.drawGrid();
        return this;
    }

    this.turnShip = function(ship, radians){
        //save old orientation
        var oldOrientation = [ship.orientation[0], ship.orientation[1]];

        //get the new orientation and change the ship's orientation to reflect this
        //simplified since radians is always (3/2)*n*PI => cos(radians) = 0;
        var x = - ship.orientation[0]*Math.sin(radians);
        var y = ship.orientation[1]*Math.sin(radians);
        ship.orientation[1] = x;
        ship.orientation[0] = y;

        var change = [  -Math.sin(radians) *(oldOrientation[0] - ship.orientation[0]),
                         Math.sin(radians) *(oldOrientation[1] - ship.orientation[1]), ]

        //turnArea has the relative xy coords as arrays
        //for every pair of these coords, we get the absolute positioning in the map
        var turnPositions = ship.turnArea.map(function(pos) {
            return [
            ship.sternPosition[0] + pos[0]*change[1],
            ship.sternPosition[1] + pos[1]*change[0]];
        });
        console.log(turnPositions);
        
        var obstruction = this.getObjectTurning(turnPositions);
        if (obstruction == undefined){ //no Objects obstruct our path. Let's finish the rotation

            //check if there's an object in the final position
            // this.checkObjectAt(ship.shipSquares);
            console.log('rotation was succesful');
            ship.__proto__ = new Ship();
            ship.updateShip([0,0]);
            this.redrawShip(ship);
        } 

        else { //print the first object that we found that blocked our path
            if (obstruction.mine && ship.name != "Mine Layer"){
                this.explodeMine(obstruction.position);
                this.damageShipSpread(ship.id, ship.bowPosition);
            }

            else if(obstruction.mineHotZone && ship.name != "Mine Layer"){
                this.explodeMine(obstruction.mineHotZone.position);
                this.damageShipSpread(ship.id, ship.bowPosition);
            }

            ship.orientation = oldOrientation;
        }

        return obstruction;
    };

    this.isMineFriendly = function(position){
        console.log(position);
        return  (this.getSquareAtPosition(position) && (this.getSquareAtPosition(position).name == 'sea'
                || (this.getSquareAtPosition(position).shipId && this.getSquareAtPosition(position).shipId.indexOf('minelayer') != -1)));
    }

    this.isNotMine = function(position){
        var square = this.getSquareAtPosition(position); 
        return  (square && square.name == 'sea'
                    && !square.mine);
    }

    /*****************Mine functions***************************/
    this.layMine = function(ship, targetSquare){
        if (ship.remainingMines > 0){

            //check mineZone and that we are inside it
            ship.mineZone.__proto__ = new MineZone();
            if (ship.mineZone.isInside(targetSquare)){
                //we check that the target square is free and has no mines
                if (this.isNotMine(targetSquare)){

                    //check four corners
                    if (this.isMineFriendly([targetSquare[0]-1,targetSquare[1]]) && this.isMineFriendly([targetSquare[0]+1,targetSquare[1]]) &&
                        this.isMineFriendly([targetSquare[0],targetSquare[1]-1]) && this.isMineFriendly([targetSquare[0],targetSquare[1]+1])) {

                        var aMine = new mineSquare(targetSquare[0], targetSquare[1]);

                        this.mineSpots[targetSquare] = aMine;

                        //careful if you delete map.shipdict[la]= ship on actions.js ...
                        ship.remainingMines--;

                        //we set hotzones around this square
                        this.setHotZone(targetSquare[0],targetSquare[1], aMine);
                    }
                }
            }
        }
    }

    this.setHotZone = function(x,y, obj){
        this.squares[x][y].mine = obj;
        this.squares[x-1][y].mineHotZone = obj;
        this.squares[x+1][y].mineHotZone = obj;
        this.squares[x][y-1].mineHotZone = obj;
        this.squares[x][y+1].mineHotZone = obj;
    }

    this.pickupMine = function(ship, targetSquare){
        if (ship.remainingMines >= 0){

            //check mineZone and that we are inside it
            ship.mineZone.__proto__ = new MineZone();
            if (ship.mineZone.isInside(targetSquare)){
                //we check that the target square is free and has no mines
                if (this.getSquareAtPosition(targetSquare) && this.getSquareAtPosition(targetSquare).mine) {
                    delete this.mineSpots[targetSquare];
                        ship.remainingMines++;

                    //we set hotzones around this square
                    this.setHotZone(targetSquare[0],targetSquare[1], undefined);
                }
            }
        }
    };

    /*****************Damaging functions***************************/

    /**
    * Usage: fireCannon(Ship ship, Square targetSquare)
    * Returns damaged squares 
    */
    //Usage: fireCannon(Ship ship, Square targetSquare)
    this.fireCannon = function(ship, targetPosition){
        var targetSquare = this.getSquareAtPosition(targetPosition);
        targetSquare.__proto__ = new Square();
        console.log("We are trying to shoot square at position: "+targetSquare.coordinateString());
        var attackingShip = ship;
        attackingShip.__proto__ = new Ship();
        var damage;
        var dangerZone = [];

        for (var i = 0; i < attackingShip.cannonPositions.length; i++) {
            console.log(attackingShip.cannonPositions[i]);
        }

        if (attackingShip.zoneContains(attackingShip.cannonPositions, targetSquare.position) == false) { // invalid target
            console.log("Attack failure: the target position " +targetSquare.coordinateString() + " is not within the cannon range of ship "+ship.name);
        } else {
            console.log("Target position is in cannon range!");
        }

        //Figure out how much damage the attack will do against a valid target 
        if (attackingShip.weapons[0] == "Heavy Cannon"){
            damage = 2;
        } else {
            damage = 1;
        }
        console.log("Assigned damage.");

        //Check what kind of square we're hitting
        var typeOfSquare = targetSquare.name; 
        console.log("Type of square is: "+typeOfSquare);
        switch (typeOfSquare) {
            case "mine":
                this.explodeMine(targetSquare.position); // Explode the mine, returning the danger zone it creates
                break;
            case "ship":
                var shipToDamage = this.shipDictionary[targetSquare.shipId];
                shipToDamage.__proto__ = new Ship();
                //ship takes damage
                if (ship != undefined) {
                    shipToDamage.takeDamage(targetPosition, damage);
                    ship.calculateAttributes();
                }
                break;
            case "base":
                targetSquare.setDamaged(true); // brute force damage the base
                break;
            case "coral":
                break;
        }
        // this will be the location of impact all the time for cannons
        return targetPosition;
    }

    //Usage: fireTorpedo(Ship ship, square targetSquare)
    this.fireTorpedo = function(ship){
        var endPosition =   [ship.bowPosition[0] + 10*ship.orientation[0],
                             ship.bowPosition[1] + 10*ship.orientation[1]];   

        var movementVector = this.makeDisplacementVector(ship.bowPosition,endPosition);

        //find closest object to our ship
        var closestObject = this.getClosestObjectForward(ship.bowPosition, movementVector, true);

        //didn't hit anything
        if (!closestObject[1]){
            //torpedo is destroyed
            return;
        }

        //hitting a ship
        else if (closestObject[1].name == 'ship'){


            //ship takes damage
            this.damageShip(closestObject[1].shipId, closestObject[1].position);

            //attempt to hit sideways
            var isPerpendicular = closestObject[1].orientation[0]*closestObject[1].orientation[0] == ship.orientation[1]*ship.orientation[1]
                               && closestObject[1].orientation[1]*closestObject[1].orientation[1] == ship.orientation[0]*ship.orientation[0]
            if (isPerpendicular){
                this.damageShipSpread(closestObject[1].shipId, closestObject[1].position);
            }

            //redraw this ship only
            this.drawShip(this.shipDictionary[closestObject[1].shipId]);

            closestObject[1].mine.__proto__ = new mineSquare();
            closestObject[1].mine.explode();

            var damageShips = (closestObject[1].mine.explode());

            //explode dangerzones
        }

        //hitting a mine
        else if (closestObject[1].mine){
            //destroy mine
            this.explodeMine(closestObject[1].position);
        }
        return closestObject.position;
    };

    this.damageShip = function(shipId, position){
            var ship = this.shipDictionary[shipId];
            ship.__proto__ = new Ship();
            ship.takeDamage(position,1);
            ship.calculateAttributes();
        }

    this.damageShipSpread = function(shipId, position){
            var ship = this.shipDictionary[shipId];
            ship.__proto__ = new Ship();
            ship.takeDamageSpread(position,1);
            ship.calculateAttributes();
        }

    this.explodeMine = function(position){
        console.log(position);
        var square = this.getSquareAtPosition(position);
        if (square && square.mine){
            //destroy mine
            delete this.mineSpots[position];

            this.squares[position[0]][position[1]].mine = undefined;

            //explode adjacents
            this.explodeMine([position[0]+1,position[1]]);
            this.explodeMine([position[0]-1,position[1]]);
            this.explodeMine([position[0],position[1]+1]);
            this.explodeMine([position[0],position[1]-1]);

        }
        else if (this.getSquareAtPosition(position) && this.getSquareAtPosition(position).name == 'ship'){
            this.damageShip(square.shipId, position, true);
            this.drawShip(this.shipDictionary[square.shipId]);
            }
    };


    /**
    * NAME: applyDamage (Tuple dangerZone)
    * PURPOSE: Applies damage to everything in the 'dangerzone':
    *           Dangerzone is tuple type -- (x-position, y-position, amountOfDamage) 
    */
    this.applyDamage = function (dangerZone) {
        var affectedShipDictionary = {}; //Keeps track of and returns ships that are affected by this function
        for (square in dangerZone) {
            var x = square[0];
            var y = square[1];
            var damage = square[2];
            var obj = this.getSquareAtPosition(x, y); 

            if (obj.name == "ship") { //ship  or base square
                obj.health -= damage;
                var name = obj.shipID;
                affectedShipDictionary[name] = this.shipDictionary[name];
            } else if (obj.name == "mine"){ //just kill mines if they're damaged
                this.explodeMine(obj.position);
            }
        }
        return affectedShipDictionary;
    };

     this.extendRadar = function(ship){
        ship.extendRadar();
    };

    this.turn180 = function(ship){

        ship.orientation = scalarMultiply(-1, ship.orientation);
        ship.sternPosition = ship.bowPosition;
        ship.updateShip([0,0]);
        this.redrawShip(ship);

    }

     this.healShip = function(ship){
        ship.healShip();
        this.redrawShip(ship);
    };    

    /**
     * NAME: selfDestruct (Square explosionOrigin)
     * PURPOSE: Generate a dangerZone in the area surrounding the ship
     */
    this.selfDestruct = function (explosionPosition) {
         var x = explosionPosition[0];
         var y = explosionPosition[1];
         console.log("X is " +x + " Y is "+y);
         var damage = 2; //kamikazes do heavy damage
         for (var i = (x-1); i <= (x+1); i++) {
             for (var j = (y-1); j <= (y+1); j++){
                var curPosition = [i,j];  
                console.log(curPosition);
                var curObj = this.getSquareAtPosition(curPosition);
                var objName = curObj.name;
                console.log(objName);
                if (objName == "sea") {
                    continue;
                } else if (objName == "ship") {
                    var ship = this.shipDictionary[curObj.shipId];
                    if (ship != undefined) { // ship will be undefined if it's a base, otherwise it should be in the dict
                        ship.__proto__ = new Ship();
                        ship.takeDamage(curPosition, damage);
                        ship.calculateAttributes();
                        if (ship.isAlive == false) { 
                            this.killShip(ship);
                        } else {
                            this.drawShip(ship);
                        }
                    }
                } else if (objName == "mine") {
                    this.explodeMine(curPosition);
                } else if (objName == "base") {
                    curObj.setDamaged(true); // brute force damage the base
                }
             }
         }

         //kill kamikaze
  //       var kSquare = this.getSquareAtPosition(explosionPosition);
//         this.killShip(this.shipDictionary[kSquare.shipId]);

    };



    /**
     * NAME: applyDamage (Tuple dangerZone)
     * PURPOSE: Applies damage to everything in the 'dangerzone':
     *           Dangerzone is tuple type -- (x-position, y-position, amountOfDamage) 
     */
     this.applyDamage = function (dangerZone) {
         var affectedShipDictionary = {}; //Keeps track of and returns ships that are affected by this function
         for (square in dangerZone) {
             var x = square[0];
             var y = square[1];
             var damage = square[2];
             var obj = this.getSquareAtPosition(x, y); 
 
             if (obj.name == "ship") { //ship  or base square
                 obj.health -= damage;
                 var name = obj.shipID;
                 affectedShipDictionary[name] = this.shipDictionary[name];
             } else if (obj.name == "mine"){ //just kill mines if they're damaged
                 this.explodeMine(obj.position);
             }
         }
         return affectedShipDictionary;
      };

    this.makeShips(false, false, false);
    this.drawGrid();

}

function shuffle(o){ //v1.0
    var mut = o;
    for(var j, x, i = mut.length; i; j = Math.floor(Math.random() * i), x = mut[--i], mut[i] = mut[j], mut[j] = x);
    return mut;
};

var scalarMultiply = function(scalar, v){
    return [scalar * v[0], scalar * v[1]];
};
