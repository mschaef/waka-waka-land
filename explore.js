
var ctx;
var tiles;

function drawTile(mX, mY, tileId)
{
    var tileOfs = 32 * tileId;

    var tileX = tileOfs % 288;
    var tileY = Math.floor(tileOfs / 288) * 288;

    ctx.drawImage(tiles, tileX, tileY, 32, 32, mX * 32, mY *32, 32, 32);    
}


function onDocumentReady()
{
    var example = document.getElementById('map');

    ctx = example.getContext('2d');

    tiles = new Image();

    tiles.src="pics/dg_grounds32.gif";

    tiles.onload = function() {
        for(var ii = 0; ii < 10; ii++)
            drawTile(ii, ii, ii);
    };
};

$(document).ready(onDocumentReady);

