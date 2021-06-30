//Create variables here
var dog, dogImg1, happyDogImg, database, foodS, foodStockRef, readStock;
var foodObj, feedTime, lastFed, currentTime;
var frameCountNow = 0;
var milk, input, name;
var gameState = "hungry";
var gameStateRef;
var bedroomImg, gardenImg, washroomImg, sleepImg, runImg;
var feed, addfood;
var input, button;

function preload()
{
	//load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/happydogImg.png");
  bedroomImg = loadImage("images/Bed Room.png")
  gardenImg = loadImage("images/Garden.png")
  washroomImg = loadImage("images/Wash Room.png")
  sleepImg = loadImage("images/Lazy.png") 
  runImg = loadImage("images/running.png")
}

function setup() {
	createCanvas(1200, 500);
  database = firebase.database();
  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  

  dog = createSprite(width/2+250, height/2,10,10);
  dog.addAnimation(dogImg);
  dog.addAnimation("happy",happyDogImg);
  dog.addAnimation("sleeping", sleepImg);
  dog.addAnimation("run", runImg);
  dog.scale = 0.3;

  getGameState();

  feed = createButton("Feed the dog");
  feed.position(700,70);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,70);
  addFood.mousePressed(addFoods);

  input = createInput("Pet Name");
  input.position(950,120);

  button = createButton("Confirm");
  button.position(1000,145);
  button.mousePressed(createName);

}


function draw() {  
currentTime = hour();
if(currentTime === lastFed + 1){
  gameState = "playing";
  updateGameState();
  foodObj.garden();
}
else if(currentTime === lastFed + 2){
  gameState = "sleeping";
  updateGameState();
  foodObj.bedroom();
}
else if(currentTime> lastFed + 2 && currentTime <= lastFed + 4){
  gameState = "bathing";
  updateGameState();
  foodObj.washroom();
}
else {
  gameState = "hungry";
  updateGameState();
  foodObj.display();
}
foodObj.display();

fedTime = database.ref('FeedTime');
fedTime.on("value", function(data){
  lastFed = data.val();
})

if(gameState === "hungry"){
  feed.show();
  addfood.show();
  dog.addAnimation("hungry", hungryDog);
}
else{
  feed.hide();
  addfood.hide();
  dog.remove();
}

  drawSprites();
  //add styles here
  textSize(32);
  fill("red");
  textSize(20);
  text("Last fed: "+lastFed+":00",300,95);
  text("Time since last fed: "+(currentTime - lastFed),300,125);
  }



function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  foodObj.deductFood();
  foodObj.updateFoodStock();
  dog.changeAnimation("happy", happyDog);
  gameState = "happy";
  updateGameState();
}

function addFoods(){
  foodObj.addFood();
  foodObj.updateFoodStock();
}

function createName(){
  input.hide();
  button.hide();

  name = input.value();
  var greeting = createElement('h3');
  greeting.html("Pet's name: "+name);
  greeting.position(width/2+850, height/2+200);
}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value", function(data){
    gameState = data.val();

  });
}

function updateGameState(){
  database.ref('/').update({
    gameState: gameState
  })
}