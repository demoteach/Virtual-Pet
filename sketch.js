var dog, dogImage, happyDog, happyDogImg, sadDoge;
var foodS, foodStock;

var gardenImage, washroomImage, livingImage;

var database;

var fedTime, lastFed, foodObj;
var feed, addFood;

var gameState, readState;

function preload()
{
 dogImage = loadImage("dogImg.png");
 happyDogImg = loadImage("dogImg1.png");
//add sad dog image here
/*  gardenImage = loadImage("Garden.png");
 washroomImage = loadImage("Wash Room.png");
 livingImage = loadImage("Living Room.png"); */
}

function setup() {
	createCanvas(1000, 400);

  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

 
  

  /* readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  }) */
  dog=createSprite(800,200,150,150);
  dog.addImage(dogImage);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

  /*   if(gameState != hungry){
      addFood.hide();
      feed.hide();
      dog.remove();
    }
    else{
      addFood.show();
      feed.show();
      dog.addImage(sadDoge);
    } */

    drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImg);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}