
var ctx;
var beCtx;
var tiles;
var edgingTiles;
var penguin;
var mapPic;

var mapContents;

var pcX = 195;
var pcY = 79;

var mapX = 184;
var mapY = 68;

var pcTol = 4;

var tileInfo = [
    { name: "Void"         , iconId: 2  , passable: false , inLegend: false },
    { name: "Deep Water"   , iconId: 20 , passable: false , inLegend: true  },
    { name: "Medium Water" , iconId: 18 , passable: false , inLegend: true  },
    { name: "Shallow Water", iconId: 15 , passable: true  , inLegend: true  }, 
    { name: "Plains"       , iconId: 9  , passable: true  , inLegend: true  }, 
    { name: "Lava"         , iconId: 36 , passable: false , inLegend: true  },
    { name: "Mountain"     , iconId: 117, passable: false , inLegend: true  },
    { name: "Desert"       , iconId: 12 , passable: true  , inLegend: true  }, 
    { name: "Road"         , iconId: 51 , passable: true  , inLegend: true  }
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

            drawTile(x, y, tileInfo[cellAt(mapdata, x + ofsX, y + ofsY, 0)].iconId);

            var obj = cellAt(mapContents, x + ofsX, y + ofsY);

            if (obj != null) {
                obj.draw(x, y);
            }

        }
    }

    ctx.drawImage(penguin, (pcX - mapX) * 32, (pcY - mapY) * 32);


    beCtx.drawImage(mapPic, 0, 0);

    beCtx.lineWidth = 2;
    beCtx.strokeStyle = '#ff0000';
  
    beCtx.beginPath();
    beCtx.rect(mapX, mapY, width - 1, height - 1);
    beCtx.stroke();
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
            ctx.drawImage(edgingTiles,
                          160, 416, 32, 32, oX * 32, oY *32, 32, 32);    
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

    $("#legendBody").html(markup);
}

function onDocumentLoaded()
{
    setupContents();

    var mapCanvas = $('#map');
    var beCanvas = $('#birdsEye');

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

    ctx = mapCanvas[0].getContext('2d');
    beCtx = beCanvas[0].getContext('2d');

    tiles = $("#imgTiles")[0];
    edgingTiles = $("#imgEdging")[0];
    penguin = $("#imgPenguin")[0];
    mapPic = $("#imgMap")[0];

    populateLegend();

    movePc(0,0);
};

$(window).load( onDocumentLoaded);

