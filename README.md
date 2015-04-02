# waka-waka-land

A quick tile-based map exploration game implemented using the HTML5 Canvas

While my son was in the second grade, he was given the assignment to draw a map of
an imaginary world on a sheet of posterboard. This software project takes his map data
and makes it into something that you can explore in the style of an 80's-era tile
based role playing game. (Think Ultima, etc.). If you want to see it in action, 
you can see it here:

http://mschaef.github.io/waka-waka-land/

# Implementation Details

All the gameplay logic is implemented using JavaScript and the HTML5 Canvas. There
is a naive map drawing loop, and the code uses the painter's algorithm to draw sprites
over the map itself.

The source of the geographical map data is
[`mapdata.gif`](https://github.com/mschaef/waka-waka-land/blob/master/pics/mapdata.gif). This is
an indexed color file with a pixel-per-tile: each index maps to a specific type of terrain with
attributes specified in the `tileInfo` array in
[`explore.js`](https://github.com/mschaef/waka-waka-land/blob/master/explore.js). The source GIF
file is translated into JSON using [`gif2js.c`](https://github.com/mschaef/waka-waka-land/blob/master/gif2js.c).
Other geographical information (location and text of signs, etc.) is defined in the main
JavaScript code.
