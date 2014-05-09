

function onDocumentReady()
{
    var example = document.getElementById('map');
    var context = example.getContext('2d');
    context.fillStyle = 'red';
    context.fillRect(30, 30, 50, 50);

    var tiles = new Image();

    tiles.src="pics/dg_grounds32.gif";

    tiles.onload = function() {
        context.drawImage(tiles, 69, 50);
    };
};

$(document).ready(onDocumentReady);

