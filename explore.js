

function onDocumentReady()
{
    var example = document.getElementById('map');
    var context = example.getContext('2d');
    context.fillStyle = 'red';
    context.fillRect(30, 30, 50, 50);
};

$(document).ready(onDocumentReady);

