/** gif2js.c
 *
 * Convert a GIF image into a JavaScript array of arrays, where each
 * array element has the color index of the corresponding GIF pixel.
 */

#include <stdio.h>

#include <gif_lib.h>

void render_js(GifFileType *gif)
{
     SavedImage *img = &(gif->SavedImages[0]);

     GifWord width = img->ImageDesc.Width;
     GifWord height = img->ImageDesc.Height;

     unsigned char *imgBits = img->RasterBits;

     int xx, yy;

     printf("var mapdata = [\n");

     for(yy = 0; yy < height; yy++) {

          printf("   [");

          for(xx = 0; xx < width; xx++) {
               printf("%d%s",
                      imgBits[xx + (yy * width)],
                      (xx == (width - 1)) ? "" : ",");
          }

          printf("]%s\n", (yy == (height - 1)) ? "" : ",");
     }


     printf("]\n");
}

int main(int argc, char* argv[])
{
     if (argc != 2) {
          fprintf(stderr, "Usage: %s <gif-file>\n", argv[0]);
          return 1;
     }

     GifFileType *gif;
     int rc;

     gif = DGifOpenFileName(argv[1]);

     if (gif == NULL) {
          fprintf(stderr, "Usage: Cannot open file: %s\n", argv[1]);
          return 1;
     }

     rc = DGifSlurp(gif);

     if (rc == GIF_OK) {
          render_js(gif);
     } else {
          fprintf(stderr, "Usage: Cannot read file: %s\n", argv[1]);
     }
     
     rc = DGifCloseFile(gif);

     if (rc != GIF_OK) {
          fprintf(stderr, "Usage: Error closing file: %s\n", argv[1]);
          return 1;
     }


     return 0;
}
