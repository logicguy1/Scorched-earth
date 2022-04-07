function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

window.onload=function(){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');

	var kanon = new Image();
	kanon.src="./img/kanon.png";

	var tux = new Image();
	tux.src="./tux.png";

	var enemie = new Image();
	enemie.src="./badppl/mac.png";
	var eniX = 300 + ((canvas.width - 500) * Math.random());

  let death = new Audio('./badppl/ouch.mp3');
  document.getElementById('beep').volume = 0.2;

  var score = 0;
  var miss = 0;
	var skud = false;
	var skudKnap = $("#skudKnap");
	var radius = 10;

  var counter = 0;
  var hit = false;

	var xconst = 100;
	var yconst = canvas.height - 80;
  var vconst = 30;
	var x = 0;
	var y = 0;
	
	var lastUpdate = Date.now();
	
	// Hastighedsslider
	var slider = document.getElementById("hastighed");
	var output = document.getElementById("hast");
	output.innerHTML = slider.value;

	slider.oninput = function() {
		output.innerHTML = this.value; // Viser hastigheden på siden
	}
	
	//Vinkelslider
	var vinkel = document.getElementById("vinkel");
	var vinkeloutput = document.getElementById("vink");
	vinkeloutput.innerHTML = vinkel.value;

	vinkel.oninput = function() {
		vinkeloutput.innerHTML = this.value; // Viser vinklen på siden

		context.clearRect(0,0,1024,800);
		context.drawImage(tux, 0,yconst-30);
		context.drawImage(enemie, eniX,canvas.height - 65);

    context.save();
    context.translate(xconst, yconst);
    context.rotate(degrees_to_radians(vinkel.value - vconst) * -1);
		context.drawImage(kanon,-xconst,0);
    context.restore();
	}
	
	//Skud
	skudKnap.click(function(){
		if (!skud) {
      miss++;
		  skud = true;
      hit = false;
	  	lastUpdate = Date.now();
	    animate();
		}
	});

  $("#start").click(function(){
    document.getElementsByClassName("start")[0].style.visibility = "hidden";
    document.getElementById("screen").style.visibility = "hidden";

    document.getElementById("beep").play();

		context.clearRect(0,0,canvas.width,canvas.height);
		context.drawImage(tux, 0,yconst-30);
    context.save();
    context.translate(xconst, yconst);
    context.rotate(degrees_to_radians(vinkel.value - vconst) * -1);
		context.drawImage(kanon,-xconst,0);
    context.restore();
		context.drawImage(enemie, eniX,canvas.height - 65);
  });
	

	function animate(){
		var dt = Date.now() - lastUpdate;

		// Kuglens koordinater
		counter += 0.02*dt;

		x = slider.value * Math.cos(degrees_to_radians(vinkel.value)) * counter;
		x += xconst

		y = slider.value * Math.sin(degrees_to_radians(vinkel.value)) * counter - 1/2 * 9.82 * Math.pow(counter, 2);
		y = yconst - y

		if (skud == true){
		  context.clearRect(0,0,canvas.width,canvas.height);
		  context.drawImage(tux, 0,yconst-30);
			context.drawImage(enemie, eniX,canvas.height - 65);

			// Kuglen tegnes
			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI, false);
			context.fillStyle = 'black';
			context.fill();	

			// Collision detection
			if (x > eniX && x < eniX + 75 && y > canvas.height - 65 && !hit){
        hit = true;
				console.log("HIT");
				eniX = 300 + ((canvas.width - 500) * Math.random());

        death.load();
        death.play();

        score++;
			  document.getElementById("scor").innerHTML = score;
      }

			lastUpdate = Date.now();

			setTimeout(animate,10);
      
      // If hits wall or floor
			if (x > canvas.width || y > canvas.height){
		    context.clearRect(0,0,canvas.width,canvas.height);
		    context.drawImage(enemie, eniX,canvas.height - 65);
				x = xconst;
				y = yconst;
				skud = false;
				counter = 0;

        console.log(miss, score)
			  document.getElementById("acc").innerHTML = Math.round(score/(miss)*100)/100;
			};
		};
		context.drawImage(tux, 0,yconst-30);

    context.save();
    context.translate(xconst, yconst);
    context.rotate(degrees_to_radians(vinkel.value - vconst) * -1);
		context.drawImage(kanon,-xconst,0);
    context.restore();
	};
animate();
};

