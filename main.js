
           vid = document.createElement('video');
           vid.id = "thePlayer";
           v = vid;

           can = document.createElement('canvas');
           can.id = "thecanvas";
           c = can;




           navigator.getUserMedia = (navigator.getUserMedia ||
                                     navigator.webkitGetUserMedia ||
                                     navigator.mozGetUserMedia ||
                                     navigator.msGetUserMedia);
           if (navigator.getUserMedia) {
              // Request access to video only
              navigator.getUserMedia(
                 {
                    video:true,
                    audio:false
                 },
                 function(stream) {
                    var url = window.URL || window.webkitURL;
                    v.src = url ? url.createObjectURL(stream) : stream;
                    v.play();
                 },
                 function(error) {
                    alert('Something went wrong. (error code ' + error.code + ')');
                    return;
                 }
              );
           }
           else {
              alert('Sorry, the browser you are using doesn\'t support getUserMedia');
              return;
           }

//the canvas part

           var isStreaming = false,
               con = c.getContext('2d');
               w = 600,
               h = 420,
               greyscale = false;

               v.addEventListener('canplay', function(e) {
                  if (!isStreaming) {
                     // videoWidth isn't always set correctly in all browsers
                     if (v.videoWidth > 0) h = v.videoHeight / (v.videoWidth / w);
                     c.setAttribute('width', w);
                     c.setAttribute('height', h);
                     // Reverse the canvas image
                     con.translate(w, 0);
                     con.scale(-1, 1);
                     isStreaming = true;
                  }
               }, false);

               v.addEventListener('play', function() {
                  // Every 33 milliseconds copy the video image to the canvas
                  setInterval(function() {
                     if (v.paused || v.ended) return;
                     con.fillRect(0, 0, w, h);
                     con.drawImage(v, 0, 0, w, h);
                     console.log(getBrightness());
                     if (greyscale) goingGrey();
                  }, 33);
               }, false);

               var getBrightness = function(){
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



               c.addEventListener('click', function() { greyscale = !greyscale; }, false);

               var goingGrey = function() {
                  var imageData = con.getImageData(0, 0, w, h);
                  var data = imageData.data;
                  console.log(imageData, data);
                  for (var i = 0; i < data.length; i += 4) {
                     var bright = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                     data[i] = bright;
                     data[i + 1] = bright;
                     data[i + 2] = bright;
                  }
                  con.putImageData(imageData, 0, 0);
               }
