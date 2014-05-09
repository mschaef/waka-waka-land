
var ctx;
var tiles;
var penguin;

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
    12    // desert
];

var passable = [
    true, // void
    false,// deep water
    false,// medium water
    true, // shallow water
    true, // plains
    false,// lava
    false,// mountain
    true  // desert
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

function cellAt(x, y)
{
    var row = mapdata[y];

    var cell = null;

    if (row != null)
        cell = row[x];

    if (cell == null)
        cell = 0;

    return cell;
}

function drawMap(ofsX, ofsY)
{
    var width = canvasWidth();
    var height = canvasHeight();

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {

            drawTile(x, y, tileMap[cellAt(x + ofsX, y + ofsY)]);
        }
    }

    ctx.drawImage(penguin, (pcX - mapX) * 32, (pcY - mapY) * 32);
}

function movePc(dX, dY)
{
    var nX = pcX + dX;
    var nY = pcY + dY;

    if (!passable[cellAt(nX, nY)])
        return;

    pcX = nX;
    pcY = nY;

    if (pcX < (mapX + pcTol))
        mapX = mapX - pcTol;

    if (pcY < (mapY + pcTol))
        mapY = mapY - pcTol;

    if (pcX > (mapX + canvasWidth() - pcTol))
        mapX = mapX + pcTol;

    if (pcY > (mapY + canvasHeight() - pcTol))
        mapY = mapY + pcTol;

    drawMap(mapX, mapY);
}

function onDocumentReady()
{
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
    tiles.src = "pics/dg_grounds32.gif";

    penguin = new Image();
    penguin.src = "pics/penguin.png";

    tiles.onload = function() {
        movePc(0,0);
    };
};

$(document).ready(onDocumentReady);

