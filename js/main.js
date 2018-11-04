var docHeight = 480;
var docWidth = 270;

var red = "#ff817b";
var green = "#9fdf9f";

var alphabet = "abcdefghijklmnopqrstuvwxyz";

var canvasHeight = docHeight;
var canvasWidth = docWidth;

var screenRatio = 0.6;

var canvasSections = [];
var Tiles = [];
var clickArea;

var spawnInterval = 70;
var speed = 3;
var lives = 5;
var Score = 0;

function startGame() {
    $(".gameTip").hide();
    //CALCULATING SIZE OF THE CANVAS
    docHeight =  $(document).height();
    docWidth = $(document).width();
    canvasHeight = 0.9 * docHeight;
    canvasWidth = screenRatio * docWidth;

    //DIVIDE THE CANVAS INTO 5 SECTIONS TO PLACE THE TILES
    canvasSections = [
      [0, canvasWidth*0.2],
      [canvasWidth*0.2, canvasWidth * 0.4],
      [canvasWidth * 0.4, canvasWidth * 0.6],
      [canvasWidth * 0.6, canvasWidth * 0.8],
      [canvasWidth * 0.8, canvasWidth]
    ];

    myGameArea.start();

    clickArea = new component(canvasWidth+150, 150, "black", 0, (canvasHeight/2 - 75), "clickArea");


}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.key = false;
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        }),
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })

    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
    //WHEN THE GAME ENDS
    stop : function() {
        clearInterval(this.interval);

  }

}


function component(width, height, color, x, y, text, active) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.active = active;

    this.update = function(){
      ctx = myGameArea.context;
       ctx.lineWidth=10;
      // console.log(this);
      if(this.text == "clickArea")
      {
        ctx.strokeStyle = "#afa2a7";
        ctx.strokeRect(this.x-20, this.y, this.width, this.height);

      }
      else
      {
        ctx.strokeStyle = "transparent";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
      }
    }

    //IF THE TILE ABOVE THE CANVAS AREA
    this.delete = function() {

      if(this.y+this.height < 0)
      {
        return true;
      }
    }

    //IF THE TILE IS IN THE TYPE AREA
    this.typeArea = function(i) {

      if(this.y > clickArea.y && this.y + this.height < clickArea.y + clickArea.height)
      {
        return true;
      }
      else if (this.y < clickArea.y && this.active == true)
      {
        Mistake(i);
      }
      return false;
    }

}


function updateGameArea() {

  if(lives <= 0)
  {
    myGameArea.stop();
  }
  else {
      myGameArea.clear();


        myGameArea.frameNo += 1;


        if(everyinterval(spawnInterval))
        {
          Tiles.push(new component(canvasWidth*0.2, 0, "#1a1a1a", canvasSections[randomIntFromInterval(0, 4)][0], canvasHeight, alphabet[randomIntFromInterval(0, 25)], true));
      }

      for (i = 0; i < Tiles.length; i += 1) {

        //IF THE TILE IS ABOVE THE CANVAS AREA
        if(Tiles[i].delete())
        {
            Tiles.splice(i, 1);
            continue;
        }
        //CORERCT KEY
        if(Tiles[i].typeArea(i) && myGameArea.key == Tiles[i].text.charCodeAt(0)-32 && Tiles[i].active == true)
        {
          Score += 10;
          Tiles[i].active = false;
          Tiles[i].color = green;

          //SPEED AND SPAWN INTERVAL UPDATE
          if(Score % 100 == 0 && Score > 0)
          {
            speed += 1;
            spawnInterval -= 8;
          }
        }
        //PRESSED THE WRONG KEY
        else if(Tiles[i].typeArea(i) && myGameArea.key != Tiles[i].text.charCodeAt(0)-32 && Tiles[i].active == true && myGameArea.key != false)
        {
          Mistake(i);

        }

        Tiles[i].y -= speed;
        ctx.font = "7vmin Arial";
        ctx.fillStyle = Tiles[i].color;
        ctx.fillText(Tiles[i].text ,Tiles[i].x + (Tiles[i].width/2) - 20, Tiles[i].y + (Tiles[i].height/2) + 20);
        Tiles[i].update();
    }

  }
  clickArea.update();



      //UPDATE SCOREBOARD
      document.getElementById("score").innerHTML = Score;

      //UPDATE LIFE HEARTHS
      var html = "";
      for(var i = 0; i < lives; i++)
      {
        html += '<i class="fas fa-heart"></i> ';
      }
      for(var j = 0; j+lives < 5; j++)
      {
        html += '<i class="far fa-heart"></i> ';
      }
      document.getElementById("life-score").innerHTML = html;

  }


function Mistake(i)
{
  Tiles[i].active = false;
  Tiles[i].color = red;
  lives -= 1;
}


function everyinterval(n) {
      if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
      return false;
  }



//RANDOM NUMBER GENERATOR
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
