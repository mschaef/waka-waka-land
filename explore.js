
var ctx;
var tiles;
var edgingTiles;
var penguin;

var mapContents;

var pcX = 195;
var pcY = 79;

var mapX = 184;
var mapY = 68;

var pcTol = 4;

var tileMap = [
    2,    // void
    20,   // deep water
    18,   // medium water
    15,   // shallow water
    9,    // plains
    36,   // lava
    117,  // mountain
    12,   // desert
    51    // road
];

var passable = [
    false,// void
    false,// deep water
    false,// medium water
    true, // shallow water
    true, // plains
    false,// lava
    false,// mountain
    true, // desert
    true
];

function drawTile(mX, mY, tileId)
{
    var tileOfs = 32 * tileId;

    var tileX = tileOfs % 288;
    var tileY = Math.floor(tileOfs / 288) * 32;

    ctx.drawImage(tiles, tileX, tileY, 32, 32, mX * 32, mY *32, 32, 32);    
}

function canvasWidth()
{
    return Math.floor(ctx.canvas.width / 32);
}

function canvasHeight()
{
    return Math.floor(ctx.canvas.height / 32);
}

function cellAt(map, x, y, defaultCell)
{
    var row = map[y];

    var cell = null;

    if (row != null)
        cell = row[x];

    if (cell == null)
        cell = defaultCell;

    return cell;
}

function drawMap(ofsX, ofsY)
{
    var width = canvasWidth();
    var height = canvasHeight();

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {

            drawTile(x, y, tileMap[cellAt(mapdata, x + ofsX, y + ofsY, 0)]);

            var obj = cellAt(mapContents, x + ofsX, y + ofsY);

            if (obj != null) {
                obj.draw(x, y);
            }

        }
    }

    ctx.drawImage(penguin, (pcX - mapX) * 32, (pcY - mapY) * 32);
}

function movePc(dX, dY)
{
    var nX = pcX + dX;
    var nY = pcY + dY;

    if (!passable[cellAt(mapdata, nX, nY, 0)])
        return;

    var obj = cellAt(mapContents, nX, nY);

    if (obj != null) {
        if(!obj.action())
            return ;
    }

    pcX = nX;
    pcY = nY;

    if (pcX <  (mapX + pcTol))
        mapX = mapX - pcTol;

    if (pcY < (mapY + pcTol))
        mapY = mapY - pcTol;

    if (pcX > (mapX + canvasWidth() - pcTol))
        mapX = mapX + pcTol;

    if (pcY > (mapY + canvasHeight() - pcTol))
        mapY = mapY + pcTol;

    drawMap(mapX, mapY);
}

function setupContents()
{
    mapContents = [];

    var ii, jj;

    for(ii = 0; ii < mapdata.length; ii++) {
        var row = [];
        
        for(jj = 0; jj < mapdata[0].length; jj++)
            row.push(null);

        mapContents.push(row);
    }

    addSign(192, 75, "Here are some mountains.");
    addSign(193, 85, "Welcome to Wakawaka land!\n\nPlease enjoy your stay.");

    addSign(193, 80, "Mount Greenland");

    addSign(177, 79, "Maka-luka Gulf");
    addSign(122, 72, "Mako-Maki Gulf");
    addSign(250, 97, "Future site of Fish Town.");
    addSign(225, 95, "Calm Beach");
    addSign(254, 122, "Future site of Beach Town.");

    addSign(177, 45, "Welcome to Gumdrop Island.");

    addSign(37, 176, "Welcome to the Capital City.");
    
}

function addSign(x, y, message)
{
    mapContents[y][x] = {
        draw: function(oX, oY) {
            ctx.drawImage(edgingTiles,
                          160, 416, 32, 32, oX * 32, oY *32, 32, 32);    
        },
        action: function() {
            alert("The sign says:\n\n" + message);
            return false;
        }
    };
}

function onDocumentReady()
{
    setupContents();

    var example = $('#map');

    $(document).keydown(function(e) {
        var kc = e.keyCode;

        if (kc == 38) // up
            movePc(0, -1);
        else if (kc == 40) // down
            movePc(0, 1);
        else if (kc == 39) // right
            movePc(1, 0);
        else if (kc == 37) // left
            movePc(-1, 0);
    });

    ctx = example[0].getContext('2d');

    tiles = new Image();
    edgingTiles = new Image();
    penguin = new Image();

/*
    tiles.onload = function() {
        movePc(0,0);
    };
*/
      movePc(0,0);

    tiles.src = "pics/dg_grounds32.gif";
    edgingTiles.src = "pics/dg_edging132.gif";
    penguin.src = "pics/penguin.png";
};

$(document).ready(onDocumentReady);

