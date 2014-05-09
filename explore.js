
var ctx;
var tiles;

var tileMap = [
    2,    // void
    20,   // deep water
    18,   // medium water
    15,   // shallow water
    9,    // plains
    36,   // lava
    117,  // mountain
    12    // desert
];

function drawTile(mX, mY, tileId)
{
    var tileOfs = 32 * tileId;

    var tileX = tileOfs % 288;
    var tileY = Math.floor(tileOfs / 288) * 32;

    ctx.drawImage(tiles, tileX, tileY, 32, 32, mX * 32, mY *32, 32, 32);    
}

function drawMap(ofsX, ofsY)
{
    var xSize = Math.floor(ctx.canvas.width / 32);
    var ySize = Math.floor(ctx.canvas.height / 32);

    for(var x = 0; x < xSize; x++) {
        for(var y = 0; y < ySize; y++) {

            var row = mapdata[y + ofsY];

            var cell = null;

            if (row != null)
                cell = row[x + ofsX];

            if (cell == null)
                cell = 0;

            drawTile(x, y, tileMap[cell]);
        }
    }
}

var xPos = 0;
var yPos = 0;

function moveMap(dX, dY)
{
    xPos = xPos + dX;
    yPos = yPos + dY;

    drawMap(xPos, yPos);
}

function onDocumentReady()
{
    var example = $('#map');

    $(document).keydown(function(e) {
        var kc = e.keyCode;

        if (kc == 38) // up
            moveMap(0, -1);
        else if (kc == 40) // down
            moveMap(0, 1);
        else if (kc == 39) // right
            moveMap(1, 0);
        else if (kc == 37) // left
            moveMap(-1, 0);

    });

    ctx = example[0].getContext('2d');

    tiles = new Image();

    tiles.src="pics/dg_grounds32.gif";

    
    tiles.onload = function() {
        drawMap(0,0);
    };
};

$(document).ready(onDocumentReady);

