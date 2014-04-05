Range = function() {
    this.relativeRange = [];
    this.getAbsolutePosition = function(position, orientation){
        var absolutePositions = this.relativeRange.map(function(relativePosition) {
            return [
            position[0] + relativePosition[0]*orientation[1],
            position[1] + relativePosition[0]*orientation[0]
            ];
        });
        return absolutePositions;
    }
}

CruiserRange = function() {//7 and 5 from center
    this.relativeRange =    [[0,1],[0,2],[0,3],[0,4],
                             [0,5],[0,6],[0,7],[0,8]
                            ];
}

DestroyerRange = function() {//5 and 4 from center
    this.relativeRange =    [[0,1],[0,2],[0,3],[0,4],
                             [0,5],[0,6],[0,7],[0,8]
                            ];
}

RadarRange = function() {// 1 and 1 from body
    this.relativeRange =    [[0,1],[0,2],[0,3],[0,4],
                             [0,5],[0,6],[0,7],[0,8]
                            ];
}

TorpedoRange = function() {
    this.relativeRange =    [[1,-1],[1,0],[1,1],[1,2],[1,3],
                             [0,-1],[0,3],
                             [-1,-1],[-1,0],[-1,1],[-1,2],[-1,3]
                            ];
}

MineLayerRange = function() {
    this.relativeRange =    [[0,1],[0,2],[0,3],[0,4],
                             [0,5],[0,6],[0,7],[0,8]
                            ];
}

CruiserRange.prototype = new Range();
DestroyerRange.prototype = new Range();
RadarRange.prototype = new Range();
TorpedoRange.prototype = new Range();
MineLayerRange.prototype = new Range();
