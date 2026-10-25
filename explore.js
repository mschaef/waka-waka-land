// Copyright (c) Mike Schaeffer. All rights reserved.
//
// The use and distribution terms for this software are covered by the
// Eclipse Public License 2.0 (https://opensource.org/licenses/EPL-2.0)
// which can be found in the file LICENSE at the root of this distribution.
// By using this software in any fashion, you are agreeing to be bound by
// the terms of this license.
//
// You must not remove this notice, or any other, from this software.

var ctxMap;
var ctxBirdsEye;
var penguin;
var mapPic;

var mapItems;

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

    ctxMap.drawImage(tileImage, tileX, tileY, 32, 32, mX * 32, mY * 32, 32, 32);
}

function canvasWidth()
{
    return Math.floor(ctxMap.canvas.width / 32);
}

function canvasHeight()
{
    return Math.floor(ctxMap.canvas.height / 32);
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

            var obj = cellAt(mapItems, x + mapX, y + mapY);

            if (obj != null) {
                obj.draw(x, y);
            }

        }
    }

    ctxMap.drawImage(penguin, (pcX - mapX) * 32, (pcY - mapY) * 32);

    ctxBirdsEye.drawImage(mapPic, 0, 0);

    ctxBirdsEye.lineWidth = 2;
    ctxBirdsEye.strokeStyle = '#ff0000';

    ctxBirdsEye.beginPath();
    ctxBirdsEye.rect(mapX, mapY, width - 1, height - 1);
    ctxBirdsEye.stroke();
}

function movePc(dX, dY)
{
    var nX = pcX + dX;
    var nY = pcY + dY;

    let passable = mapTileAt(mapdata, nX, nY).passable;

    if (passable) {
        var obj = cellAt(mapItems, nX, nY);

        if (obj != null) {
            if(!obj.action())
                return true;
        }

        pcX = nX;
        pcY = nY;
    }

    drawMap();

    return passable;
}

function setupContents()
{
    mapItems = [];

    var ii, jj;

    for(ii = 0; ii < mapdata.length; ii++) {
        var row = [];

        for(jj = 0; jj < mapdata[0].length; jj++)
            row.push(null);

        mapItems.push(row);
    }

    addItem(192, 75, makeSign("Here are some mountains."));
    addItem(194, 79, makeSign("Welcome to Wakawaka land!\n\nPlease enjoy your stay."));

    addItem(194, 95, makeSign("Mount Greenland"));

    addItem(177, 79, makeSign("Maka-luka Gulf"));
    addItem(122, 72, makeSign("Mako-Maki Gulf"));
    addItem(250, 97, makeSign("Future site of Fish Town."));
    addItem(225, 95, makeSign("Calm Beach"));
    addItem(254, 122, makeSign("Future site of Beach Town."));

    addItem(177, 45, makeSign("Welcome to Gumdrop Island."));

    addItem(37, 176, makeSign("Welcome to the Capital City."));
}

function makeSign(message) {
    return {
        draw: function(oX, oY) {
            drawTile(oX, oY, tileInfo[9]);
        },
        action: function() {
            alert("The sign says:\n\n" + message);
            return false;
        }
    };
}

function addItem(x, y, item)
{
    mapItems[y][x] = item;
}

function setupTileSets() {
    var tileImages = elemsBySelector('.tiles');

    for(var ii = 0; ii < tileImages.length; ii++) {
        tileSets[tileImages[ii].id] = tileImages[ii];
    }
}

function navigateUp() {
    if (!movePc(0, -1)) {
        movePc(1, -1) || movePc(-1, -1);
    }
}

function navigateDown() {
    if (!movePc(0, 1)) {
        movePc(1, 1) || movePc(-1, 1);
    }
}

function navigateLeft() {
    if (!movePc(1, 0)) {
        movePc(1, 1) || movePc(1, -1);
    }
}

function navigateRight() {
    if (!movePc(-1, 0)) {
        movePc(-1, 0) || movePc(-1, -1);
    }
}

function onDocumentLoaded()
{
    setupContents();
    setupTileSets();

    ctxMap = elemBySelector('#map').getContext('2d');
    ctxBirdsEye = elemBySelector('#birdsEye').getContext('2d');

    document.onkeydown = function(e) {
        switch(e.keyCode) {
        case 38: navigateUp();    break;
        case 40: navigateDown();  break;
        case 39: navigateLeft();  break;
        case 37: navigateRight(); break;
        }
    };

    penguin = elemBySelector("#imgPenguin");
    mapPic = elemBySelector("#imgMap");

    drawMap();
};

document.addEventListener('DOMContentLoaded', onDocumentLoaded);
