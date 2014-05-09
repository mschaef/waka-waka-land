
var ctx;
var tiles;


function drawTile(mX, mY, tileId)
{
    var tileOfs = 32 * tileId;

    var tileX = tileOfs % 288;
    var tileY = Math.floor(tileOfs / 288) * 32;

    ctx.drawImage(tiles, tileX, tileY, 32, 32, mX * 32, mY *32, 32, 32);    
}


function onDocumentReady()
{
    var example = document.getElementById('map');

    ctx = example.getContext('2d');

    tiles = new Image();

    tiles.src="pics/dg_grounds32.gif";

    tiles.onload = function() {
        for(var x = 0; x < 10; x++) {
            for(var y = 0; y < 10; y++) {
                drawTile(x, y, mapdata[x][y]);
            }
        }
    };
};

$(document).ready(onDocumentReady);

