// Copyright (c) Mike Schaeffer. All rights reserved.
//
// The use and distribution terms for this software are covered by the
// Eclipse Public License 2.0 (https://opensource.org/licenses/EPL-2.0)
// which can be found in the file LICENSE at the root of this distribution.
// By using this software in any fashion, you are agreeing to be bound by
// the terms of this license.
//
// You must not remove this notice, or any other, from this software.

var ctx;
var birdsEyeCtx;
var penguin;
var mapPic;

var mapContents;

var pcX = 195;
var pcY = 79;

var mapX = 184;
var mapY = 68;

var MAP_SCROLL_THRESHOLD = 4;

var tileSets = {};

var tileInfo = [
    { name: "Void"         , tileSet: 'imgTiles' , iconId: 2   , passable: false },
    { name: "Deep Water"   , tileSet: 'imgTiles' , iconId: 20  , passable: false },
    { name: "Medium Water" , tileSet: 'imgTiles' , iconId: 18  , passable: false },
    { name: "Shallow Water", tileSet: 'imgTiles' , iconId: 15  , passable: true  },
    { name: "Plains"       , tileSet: 'imgTiles' , iconId: 9   , passable: true  },
    { name: "Lava"         , tileSet: 'imgTiles' , iconId: 36  , passable: false },
    { name: "Mountain"     , tileSet: 'imgTiles' , iconId: 117 , passable: false },
    { name: "Desert"       , tileSet: 'imgTiles' , iconId: 12  , passable: true  },
    { name: "Road"         , tileSet: 'imgTiles' , iconId: 51  , passable: true  },
    { name: "Sign"         , tileSet: 'imgEdging', iconId: 109 , passable: true  }
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


function drawTile(mX, mY, tile)
{
    var tileImage = tileSets[tile.tileSet];

    var tileId = tile.iconId;

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

function cellAt(map, x, y)
{
    var row = map[y];

    var cell = null;

    if (row != null)
        cell = row[x];

    return cell;
}

function mapTileAt(map, x, y) {
    return tileInfo[cellAt(map, x, y) || 0];
}

function maybeScrollMap() {
    if (pcX <  (mapX + MAP_SCROLL_THRESHOLD)) {
        mapX = mapX - MAP_SCROLL_THRESHOLD;
    }

    if (pcY < (mapY + MAP_SCROLL_THRESHOLD)) {
        mapY = mapY - MAP_SCROLL_THRESHOLD;
    }

    if (pcX > (mapX + canvasWidth() - MAP_SCROLL_THRESHOLD)) {
        mapX = mapX + MAP_SCROLL_THRESHOLD;
    }

    if (pcY > (mapY + canvasHeight() - MAP_SCROLL_THRESHOLD)) {
        mapY = mapY + MAP_SCROLL_THRESHOLD;
    }
}

function drawMap()
{
    maybeScrollMap();

    var width = canvasWidth();
    var height = canvasHeight();

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {

            drawTile(x, y, mapTileAt(mapdata, x + mapX, y + mapY));

            var obj = cellAt(mapContents, x + mapX, y + mapY);

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

    if (mapTileAt(mapdata, nX, nY).passable) {
        var obj = cellAt(mapContents, nX, nY);

        if (obj != null) {
            if(!obj.action())
                return ;
        }

        pcX = nX;
        pcY = nY;
    }

    drawMap();
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

    movePc(0,0);
};

document.addEventListener('DOMContentLoaded', onDocumentLoaded);
