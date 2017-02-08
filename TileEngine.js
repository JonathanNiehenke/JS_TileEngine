function pushKey(obj, key, value) {
    let arr = obj[key];
    if (arr) {
        arr.push(value);
    }
    else {
        obj[key] = [value];
    }
}

function Engine(Tile, playerTile) {
    this.Tile = Tile;
    this.playerTile = playerTile;
    this.Levels = undefined;  // Will hold function generator of levels;
    this.Environment = {};
    this.establishEnvironment = function(Environment, Structure) {
        let structureEl = document.getElementById("Structure");
        structureEl.innerHTML = "";  // Removing all decendants.
        let colLength = Structure.length;
        for (let x = 0; x < colLength; ++x) {
            let rowDiv = document.createElement("div");
            let Row = Structure[x];
            let rowLength = Row.length;
            for (let y = 0; y < rowLength; ++y) {
                let Cell = {"index": [x, y], "value": Row[y]};
                Environment.cell[Cell.index] = Cell.value;
                pushKey(Environment.cellLocations, Cell.value, Cell.index);
                let newTile = this.Tile[Cell.value].image.cloneNode();
                rowDiv.appendChild(newTile);
            }
            rowDiv.id = `row${x}`;
            structureEl.appendChild(rowDiv);
        }
    };
    this.nextEnvironment = function() {
        let Level = this.Levels.next().value;
        let Environment = {
            "cell": {},
            "cellLocations": {},
            "onCell": " ",
            "facing": "v",
            "player": [0, 0],
            // "end": [0, 0],
        };
        if (Level) {
            this.establishEnvironment(Environment, Level);
            startIndex = Environment.cellLocations[this.playerTile][0];
            Environment.cell[startIndex] = " ";
            Environment.player = startIndex;
            // endLocations = Environment.cellLocations["E"];
            // endIndex = endLocations ? endLocations[0] : startIndex;
            // Environment.end = endIndex;
        }
        return Environment;
    };
    this.replaceImage = function(Index, cellValue) {
        let rowDiv = document.getElementById(`row${Index[0]}`);
        let newImgEl = this.Tile[cellValue].image.cloneNode();
        let currentImgEl = rowDiv.getElementsByTagName("img")[Index[1]];
        rowDiv.replaceChild(newImgEl, currentImgEl);
    };
    this.replaceCell = function(cellIndex, cellValue) {
        this.Environment.cell[cellIndex] = cellValue;
        this.replaceImage(cellIndex, cellValue);
    };
    this.replaceAllCells = function(initalValue, newValue) {
        for (cellIndex of this.Environment.cellLocations[initalValue] || []) {
            this.replaceCell(cellIndex, newValue);
        }
    };
    this.movePlayer = function(moveTo, cellTo, Movement) {
        let Environment = this.Environment;
        this.replaceImage(Environment.player, Environment.onCell);
        let directionImg  = {
            "-1,0": "^",
            "1,0": "v",
            "0,-1": "<",
            "0,1": ">",
        }[Movement];
        this.replaceImage(moveTo, directionImg);
        Environment.onCell = Environment.cell[moveTo];
        Environment.player = moveTo;
        Environment.facing = directionImg;
    };
}
