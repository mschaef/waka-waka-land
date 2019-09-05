var ctx;
var birdsEyeCtx;
var penguin;
var mapPic;

var mapContents;

var pcX = 195;
var pcY = 79;

var mapX = 184;
var mapY = 68;

var pcTol = 4;

var tileSets = {};

var tileInfo = [
    { name: "Void"         , tileSet: 'imgTiles' , iconId: 2   , passable: false , inLegend: false },
    { name: "Deep Water"   , tileSet: 'imgTiles' , iconId: 20  , passable: false , inLegend: true  },
    { name: "Medium Water" , tileSet: 'imgTiles' , iconId: 18  , passable: false , inLegend: true  },
    { name: "Shallow Water", tileSet: 'imgTiles' , iconId: 15  , passable: true  , inLegend: true  },
    { name: "Plains"       , tileSet: 'imgTiles' , iconId: 9   , passable: true  , inLegend: true  },
    { name: "Lava"         , tileSet: 'imgTiles' , iconId: 36  , passable: false , inLegend: true  },
    { name: "Mountain"     , tileSet: 'imgTiles' , iconId: 117 , passable: false , inLegend: true  },
    { name: "Desert"       , tileSet: 'imgTiles' , iconId: 12  , passable: true  , inLegend: true  },
    { name: "Road"         , tileSet: 'imgTiles' , iconId: 51  , passable: true  , inLegend: true  },
    { name: "Sign"         , tileSet: 'imgEdging', iconId: 109 , passable: true  , inLegend: true  }
];

function elemsBySelector(selector) {
    return document.querySelectorAll(selector);
}

function elemBySelector(selector) {
    var elements = elemsBySelector(selector);

    if (elements.length == 0) {
        console.error('Expected missing element with selector: ' + selector);
    } else if (elements.length > 0) {
        if (elements.length > 1) {
            console.error('Warning: more than one element with selector: ' + selector);
        }

        return elements[0];
    }

    return null;
}


function drawTile(mX, mY, tileInfo)
{
    var tileImage = tileSets[tileInfo.tileSet];

    var tileId = tileInfo.iconId;

    var tileOfs = 32 * tileId;

    var tileX = tileOfs % tileImage.width;
    var tileY = Math.floor(tileOfs / tileImage.width) * 32;

    ctx.drawImage(tileImage, tileX, tileY, 32, 32, mX * 32, mY * 32, 32, 32);
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

            drawTile(x, y, tileInfo[cellAt(mapdata, x + ofsX, y + ofsY, 0)]);

            var obj = cellAt(mapContents, x + ofsX, y + ofsY);

            if (obj != null) {
                obj.draw(x, y);
            }

        }
    }

    ctx.drawImage(penguin, (pcX - mapX) * 32, (pcY - mapY) * 32);


    birdsEyeCtx.drawImage(mapPic, 0, 0);

    birdsEyeCtx.lineWidth = 2;
    birdsEyeCtx.strokeStyle = '#ff0000';

    birdsEyeCtx.beginPath();
    birdsEyeCtx.rect(mapX, mapY, width - 1, height - 1);
    birdsEyeCtx.stroke();
}

function movePc(dX, dY)
{
    var nX = pcX + dX;
    var nY = pcY + dY;

    if (!tileInfo[cellAt(mapdata, nX, nY, 0)].passable)
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
    addSign(194, 79, "Welcome to Wakawaka land!\n\nPlease enjoy your stay.");

    addSign(194, 95, "Mount Greenland");

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
            drawTile(oX, oY, tileInfo[9]);
        },
        action: function() {
            alert("The sign says:\n\n" + message);
            return false;
        }
    };
}

function spriteMarkup(tileId)
{
    var tileOfs = 32 * tileId;

    var tileX = tileOfs % 288;
    var tileY = Math.floor(tileOfs / 288) * 32;

    var markup = "";

    markup += "<div class='clipwrapper'>\n";
    markup += "  <img class='clip' src='pics/dg_grounds32.gif' \n";
    markup += "       style='clip:rect(" + tileY + "px " + (tileX + 32) + "px " + (tileY + 32) + "px " + tileX  + "px); " ;
    markup += "              left:" + (-tileX) + "px ;";
    markup += "              top:" + (-tileY) + "px'/>\n";
    markup += "</div>\n";

    return markup;
}


function populateLegend()
{
    var markup = "";

    for(var ii = 0; ii < tileInfo.length; ii++) {
        var tile = tileInfo[ii];

        if (!tile.inLegend)
            continue;

        markup += ("<div class=\"entry\">"
                   + spriteMarkup(tile.iconId)
                   + "<b>" + tile.name + "</b>"
                   + "</div>");
    }

    elemBySelector("#legendBody").innerHtml = markup;
}

function setupTileSets() {
    var tileImages = elemsBySelector('.tiles');

    for(var ii = 0; ii < tileImages.length; ii++) {
        tileSets[tileImages[ii].id] = tileImages[ii];
    }
}

function onDocumentLoaded()
{
    setupContents();
    setupTileSets();

    ctx = elemBySelector('#map').getContext('2d');
    birdsEyeCtx = elemBySelector('#birdsEye').getContext('2d');

    document.onkeydown = function(e) {
        switch(e.keyCode) {
        case 38: movePc(0, -1); return; // up
        case 40: movePc(0, 1) ; return; // down
        case 39: movePc(1, 0) ; return; // right
        case 37: movePc(-1, 0); return; // left
        }
    };

    penguin = elemBySelector("#imgPenguin");
    mapPic = elemBySelector("#imgMap");

    populateLegend();

    movePc(0,0);
};

document.addEventListener('DOMContentLoaded', onDocumentLoaded);
