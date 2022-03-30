
window.onload = function() {
    let canvasWidth = 420;
    let canvasHeight = 420;
    let canvas;
    let ctx;
    let blockSize = 20;
    let delay = 100;
    let snakeDr;
    let appleDr;
    let widthInBlocks = canvasWidth / blockSize;
    let heightInBlocks = canvasHeight / blockSize;
    let score;
    let timeout;
    let gameBoy;

    init();

    function init() {
          
        let gameBoy = document.createElement("div");
        gameBoy.classList.add("game-Bg");
        document.body.prepend(gameBoy);
        canvas = document.createElement('canvas');
        
        canvas.width = 420;
        canvas.height = 420;
        canvas.style.border = "10px solid black";
     
        ctx = canvas.getContext('2d');
        snakeDr =new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        appleDr = new Apple([10,10]);
        score = 0;
        gameBoy.appendChild(canvas);
        gameBoy.style.display="flex";
        gameBoy.style.zIndex="5";
        gameBoy.style.justifyContent="center";
        gameBoy.style.height= "100vh";
        gameBoy.style.padding= "50px";
        gameBoy.style.alignItems = "start";
        gameBoy.style.background = "url('gb.svg') no-repeat";
        gameBoy.style.backgroundPosition = "50% 26px";
        refreshCanvas();
    }

    function refreshCanvas() {
            snakeDr.advance();
            if(snakeDr.checkCollision()) {
                gameOver();
            }
            else {
                if (snakeDr.isEatingApple(appleDr)) {   
                    score++;
                    snakeDr.ateApple = true;
                    do {
                        appleDr.setNewPosition();
                    }
                    while(appleDr.isOnSnake(snakeDr))
                }
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                snakeDr.draw();
                appleDr.draw();
                drawScore();
                timeout = setTimeout(refreshCanvas, delay);
            }
    }
    
    function gameOver() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 160);
        ctx.fillText("Game Over", centreX, centreY - 160);
        ctx.font = "bold 30px sans-serif";
        ctx.fillText("Perdu couillon", centreX, centreY - 80);
        ctx.fillText("Space for restart", centreX, centreY - 30);
        ctx.restore();
    }

    function restart() {
        snakeDr =new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        appleDr = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore() {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);

    }

    function Snake(body, direction) {

        this.body = body;
        this.direction = direction;
        this.ateApple = false;
 
        this.draw = function() {
            ctx.save();
            ctx.fillStyle="#ff0000";
            for (var i=0 ; i < this.body.length ; i++){
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function() {
            var nextPosition = this.body[0].slice();
            switch(this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalid direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple) {
                this.body.pop();
            } else {
                this.ateApple = false;
            }
         };

         this.setDirection = function(newDirection) {
             let allowedDirections;
             switch(this.direction) {
                  case "left":
                  case "right":
                      allowedDirections = ["up", "down"];
                      break;  
                  case "down":
                  case "up":
                    allowedDirections = ["left", "right"];
                      break;
                  default:
                      throw("Invalid direction");  
             }
             if(allowedDirections.indexOf(newDirection) > -1) {
                 this.direction = newDirection;
                }
         };
         
         this.checkCollision = function() {
             let wallCollision = false;
             let snakeCollision = false;
             let head = this.body[0];
             let rest = this.body.slice(1);
             let snakeX = head[0];
             let snakeY = head[1];
             let minX = 0;
             let minY = 0;
             let maxX = widthInBlocks - 1;
             let maxY = heightInBlocks - 1;
             let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
             let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

                if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                    wallCollision = true;
                }
                
                for(let i = 0; i < rest.length; i++) {
                    if(snakeX == rest[i][0] && snakeY == rest[i][1]) {
                        snakeCollision = true;
                    }
                }
                 return wallCollision || snakeCollision;
            };

            this.isEatingApple = function(appleToEat) {
                let head = this.body[0];

                if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                    return true;
                } else {
                    return false;
                }
            }    
    }

    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            let radius = blockSize /2;
            let x = this.position[0] * blockSize + radius;
            let y = this.position[1] * blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        }

        this.setNewPosition = function() {
          let newX = Math.round(Math.random() * (widthInBlocks - 1));
          let newY = Math.round(Math.random() * (heightInBlocks - 1));
          this.position = [newX, newY]; 
        };

        this.isOnSnake = function(snakeToCheck) {
            let isOnSnake = false;
            for (let i = 0; i < snakeToCheck.body.length; i++) {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1] ){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }

    document.addEventListener("keydown", function(e) {
        let key = e.key;
        let newDirection;
        
        switch(key) {
            case 'ArrowLeft':
                newDirection = "left"
                break;
            case 'ArrowUp':
                newDirection = "up"
                break;
            case 'ArrowRight':
                newDirection = "right"
                break;
            case 'ArrowDown':
                newDirection = "down"
                break;
            case ' ':
                restart();
                return;
            default:
                    return;  
        }

            snakeDr.setDirection(newDirection);
    });

    
    // canvas.style.display = "flex";
    // canvas.style.justifyContent = "center";
  

    
   
    
    

}