function pushKey(obj, key, value) {
    let arr = obj[key];
    if (arr) {
        arr.push(value);
    }
    else {
        obj[key] = [value];
    }
}

function IndexObj(x, y) {
    this.x = x;
    this.y = y;
    this.add = function(other) {
        return new IndexObj(this.x + other.x, this.y + other.y);
    };
    this.toString = function() {
        return `${this.x},${this.y}`;
    };
    return this;
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
            let Row = Structure[x];
            let rowDiv = document.createElement("div");
            let rowLength = Row.length;
            for (let y = 0; y < rowLength; ++y) {
                let index = new IndexObj(x, y);
                let value = Row[y];
                Environment.cell[index.toString()] = value;
                pushKey(Environment.cellLocations, value, index);
                rowDiv.appendChild(this.Tile[value].image.cloneNode());
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
            "player": new IndexObj(0, 0),
            "end": new IndexObj(0, 0),
        };
        // Prevents error caused by undefined level.
        if (Level) {
            this.establishEnvironment(Environment, Level);
            startIndex = Environment.cellLocations[this.playerTile][0];
            Environment.player = startIndex;
            Environment.cell[startIndex.toString()] = " ";
            // endLocations = Environment.cellLocations["E"];
            // endIndex = endLocations ? endLocations[0] : startIndex;
            // Environment.end = endIndex;
        }
        return Environment;
    };
    this.replaceImage = function(Index, tileValue) {
        let rowDiv = document.getElementById(`row${Index.x}`);
        let newImgEl = this.Tile[tileValue].image.cloneNode();
        let currentImgEl = rowDiv.getElementsByTagName("img")[Index.y];
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
    this.placePlayer = function(toIndex, imgValue) {
        let fromIndex = this.Environment.player;
        this.replaceImage(
            fromIndex, this.Environment.cell[fromIndex.toString()]);
        this.replaceImage(toIndex, imgValue);
        this.Environment.player = toIndex;
    };
}

