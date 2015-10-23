# Ambient lux
This is an experiment in measuring the user ambient light and changing the UI based on that data.

See the [demo here](http://filipemerker.github.io/ambient-lux/)

This demo uses `getUserMEdia` html5 API to acces the user's webcam. After that, it loop through the pixels using a custom function to detect rgb bright of every pixel, returning a "bright" percentual that is used to handle the UI changes.

      getBrightness = function(){
        var imageData = con.getImageData(0, 0, w, h);
        var data = imageData.data;
        var r,g,b,avg;
        var colorSum = 0;
        var l = data.length;
          for(var x = 0, len = l; x < len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];
            avg = Math.floor((r+g+b)/3);
            colorSum += avg;
        }
        var brightness = Math.floor(colorSum / (w*h));
        return brightness;
      }

## Credits
**Music** https://www.youtube.com/watch?v=6Byew7KNS6Y

**Brightness check logic** https://gist.github.com/codearachnid/5983831

**Particles** http://vincentgarreau.com/particles.js/

**Face recognition** http://auduno.github.io/clmtrackr/clm_video.html

