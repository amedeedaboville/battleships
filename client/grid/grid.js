function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Template.grid.helpers({
    rows: function () {
        var grid = [];
        //build the sea
        for(var i = 0; i < 30; i++) {
            grid[i] = [];
            for( j = 0; j < 30; j++) {
                grid[i].push("sea");
            }
        }
        for(var i = 0; i < 10; i++) {
            grid[i+10][0]  = "bluebase";
            grid[i+10][29] = "redbase";
        }

        var coralSpots = [];
        while(coralSpots.length < 24) {
            var newSpot = [getRandomInt(3,26), getRandomInt(10,20)];
            var spotAlreadyPicked = false;
            for(var i = 0; i < coralSpots.length; i++) {
                if(coralSpots[i][0] == newSpot[0] && coralSpots[i][1] == newSpot[1]) {
                    spotAlreadyPicked  = true;
                    break;
                }
            }
            if (!spotAlreadyPicked) {
                coralSpots.push(newSpot);
                grid[newSpot[0]][newSpot[1]] = "coral";

            }
        }
        return grid;
    }});

Template.grid.rendered = function(){
    console.log('Grid rendered');
}
