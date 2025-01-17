var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var gameOver, restart;
var gameOverImage, restartImage;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;

var score;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(1520, 760); // Set canvas size to fullscreen
  score = 0;
  trex = createSprite(100, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, displayWidth, 20); // Set ground width to displayWidth
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + score / 30);

  invisibleGround = createSprite(200, 190, displayWidth, 10); // Set invisibleGround width to displayWidth
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  gameOver = createSprite(displayWidth / 2, displayHeight / 2 - 50, 10, 10); // Center game over
  gameOver.addImage("gameOver", gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(displayWidth / 2, displayHeight / 2, 10, 10); // Center restart
  restart.addImage("restart", restartImage);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(180);
  textSize(24);
  text("Score: " + score, displayWidth - 200, 50); // Adjust score position
  trex.collide(invisibleGround);
  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 50);

    if (keyDown("space") && trex.y > 161) {
      trex.velocityY = -15;
    }

    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }

    spawnClouds();
    spawnObstacles();
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0); 
    cloudsGroup.setVelocityXEach(0);
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Your Score: " + score, displayWidth / 2, displayHeight / 2 + 50);
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth, random(80, 120), 40, 10);
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = displayWidth / 3; // Adjust lifetime based on displayWidth

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth, 165, 10, 40);
    obstacle.velocityX = -4;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    // assign scale and lifetime to the obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = displayWidth / 4; // Adjust lifetime based on displayWidth
    // add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score = 0;
}