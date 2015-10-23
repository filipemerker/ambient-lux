(function(){
   vid = document.createElement('video');
   vid.id = "thePlayer";
   v = vid;
   can = document.getElementById('screen');
   c = can;

   var music = new Audio;
   music.src = "assets/mp3/soundtrack.mp3";
   music.volume = 0;
   music.loop = true;
   music.play();

   var ctracker = new clm.tracker();
   ctracker.init(pModel);
   ctracker.start(c);              
   var canvasInput = document.getElementById('canvas2');
   var cc = canvasInput.getContext('2d');
   function drawLoop() {
     requestAnimationFrame(drawLoop);
     cc.clearRect(0, 0, canvasInput.width, canvasInput.height);

     ctracker.draw(canvasInput);
   }
   drawLoop();

   var _qsa = function(query){
    queryResult = document.querySelectorAll(query);

    return queryResult;
   }



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
             if (greyscale) going3D();
          }, 33);

          //"Is the ambient Dark?" loop
          setInterval(function(){
            if(getBrightness() < 90){
               _qsa("body")[0].classList.add("dark");
               switcher(1);
            }else{
               _qsa("body")[0].classList.remove("dark");
               switcher(0);
            }
          }, 1000);
       }, false);

       var switcher = function(sw){
          $(music).stop().animate({volume: sw});
          $('#particles-js').stop().animate({opacity: sw});
          $('#canvas2').stop().animate({opacity: sw});
       }



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

       var going3D = function() {
          var imageData = con.getImageData(0, 0, 970, 640);
          var data = imageData.data;
          l = data.length;
          for (var i=0; i<l; i+=4) {
            data[i] += 40;
            data[i+1] += 40;
            data[i+2] += 40;
          }
          for (y = 0; y < 640 ; y++) {
            for (x = 0; x < 960; x++) {
              data[4*y*970+x*4+1] = data[4*y*970+(x+960)*4+1];
              data[4*y*970+x*4+2] = data[4*y*970+(x+960)*4+2];
            }
          };

          con.putImageData(imageData,0,0);
       }


               


  //particlesJS
  particlesJS("particles-js", {
   "particles": {
     "number": {
       "value": 80,
       "density": {
         "enable": true,
         "value_area": 800
       }
     },
     "color": {
       "value": "#82FF32"
     },
     "shape": {
       "type": "circle",
       "stroke": {
         "width": 0,
         "color": "#000000"
       },
       "polygon": {
         "nb_sides": 5
       },
       "image": {
         "src": "img/github.svg",
         "width": 100,
         "height": 100
       }
     },
     "opacity": {
       "value": 0.5,
       "random": false,
       "anim": {
         "enable": false,
         "speed": 1,
         "opacity_min": 0.1,
         "sync": false
       }
     },
     "size": {
       "value": 1,
       "random": true,
       "anim": {
         "enable": false,
         "speed": 40,
         "size_min": 0.1,
         "sync": false
       }
     },
     "line_linked": {
       "enable": true,
       "distance": 150,
       "color": "#82FF32",
       "opacity": 0.4,
       "width": 1
     },
     "move": {
       "enable": true,
       "speed": 12,
       "direction": "none",
       "random": false,
       "straight": false,
       "out_mode": "out",
       "bounce": false,
       "attract": {
         "enable": false,
         "rotateX": 600,
         "rotateY": 1200
       }
     }
   },
   "interactivity": {
     "detect_on": "canvas",
     "events": {
       "onhover": {
         "enable": true,
         "mode": "grab"
       },
       "onclick": {
         "enable": true,
         "mode": "push"
       },
       "resize": true
     },
     "modes": {
       "grab": {
         "distance": 140,
         "line_linked": {
           "opacity": 1
         }
       },
       "bubble": {
         "distance": 400,
         "size": 40,
         "duration": 2,
         "opacity": 8,
         "speed": 3
       },
       "repulse": {
         "distance": 200,
         "duration": 0.4
       },
       "push": {
         "particles_nb": 4
       },
       "remove": {
         "particles_nb": 2
       }
     }
   },
   "retina_detect": true
  });
})();
