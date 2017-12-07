//general
var winW = window.innerWidth-4;
var winH = window.innerHeight-4;
//terrain
var ckSize = 150; //Width of chunks
var ckNumber = 50; //Number of chunks to be generated in the world
var ckTab =[];
var ckH = 50; //Height of randomly generated chunks
//scroll
var advance = 0;
var screenLim = 0.7 // Gives freedom between player and scrolling. Set between 1 and 0.2
//player size
var persH = 50; // Player Height. Only for visuals
var persW = 50; // Player Width. Needed for correct game work
//player movement
var persSpeed = 2; //Walk Speed
var sprintSpeed = 2; //Sprint Speed Multiplier
var sprint = 1
var gravity = 1; // Augment to make player fall faster and sooner
var jump = 0;
var jumpH = 11; // Augment to make player jump higher
//spawn coord
var PosX = 0; //X Coord to spawn the player
var PosY = (winH/2) - persH - 50; //Y Coor to spawn the player
//screen cord
var realX = 0;
var realY = PosY;
//debug
var debug = true; //Dev UI

//Determines if the player has a plaform on his chunk
function chunkHeight(){
	var ckHeight = 0;
	if (ckTab[Math.floor(PosX/ckSize)] > 0){
		ckHeight = ckTab[Math.floor(PosX/ckSize)];
	}
	if (ckTab[Math.floor((PosX + persW)/ckSize)] > 0){
		ckHeight = ckTab[Math.floor((PosX + persW)/ckSize)];
	}
	return ckHeight;
}
function setup() {  
	frameRate(60); // Game FPS
	createCanvas(winW, winH);   
	line(0, winH/2, winW, winH/2);
	//Assignes the chunks with their heights
	for(var i = 0; i<ckNumber; i++){
		var rand = Math.random() >= 0.5;
		if(rand == true){
			ckTab[i] = ckH;
		}else {
			ckTab[i] = 0;
		}
	}
}

function draw() {  
	background(255);
	if (keyIsDown(16)){
		sprint = sprintSpeed;
	} else {
		sprint = 1;
	}
	//Q
	if (keyIsDown(81)){
		if (PosX > 0){
			PosX -= persSpeed*sprint;
		}
	}
	//D
	if (keyIsDown(68)){
			PosX += persSpeed*sprint;
	}
	//Gravity
	if (PosY < (winH/2) - persH - chunkHeight() || jump != 0){
		jump -= gravity;
	}
	//Landing
	if ((PosY > (winH/2) - persH - chunkHeight()) && jump < 0	){
		PosY = (winH/2) - persH - chunkHeight();
		jump = 0;
	}
	PosY -= jump;
	//Scroll
	realX = PosX - advance;
	realY = PosY;
	if (realX >= winW*screenLim){
		advance += persSpeed*sprint;
	}
	if (realX <= winW- winW*screenLim){
		if(advance > persSpeed*sprint){
		advance -= persSpeed*sprint;
		}
	}
	
	//Floor
	line(0, winH/2, winW, winH/2);
	//Draw player
	rect(realX, realY, persW, persH); 
	//Platformes
	for (var i = 0; i < ckNumber; i++){
		line(i*ckSize - advance, winH/2 - ckTab[i], (i+1)*ckSize - advance, winH/2 - ckTab[i]);
	}
	//debug
	if (debug === true){
		text("X :" + PosX, 10, 30);
		text("Y :" + PosY, 10, 60);
		text("ScreenX :" + Math.floor(winW-winW*screenLim) + "/" + realX + "/" + Math.floor(winW*screenLim), 100, 30);
		text("ScreenY :" + realY, 100, 60);
		text("ScreenAdvance :" + advance, 100, 90);
		text("Sprint :" + sprint, 10, 120);
		text("Jump :" + jump + " - " + gravity, 10, 150);
		text("ChunkH :" + chunkHeight(), 10, 180);
		// text("Memo : Cheatcode fly" , 500, 30);
		for (var i = 0; i < ckNumber; i++){
			line(i*ckSize - advance, winH/2, i*ckSize - advance, winH);
			text(i, i*ckSize+(ckSize/2) - advance, winH/2 + winH/4);
			text(Number(ckTab[i]), i*ckSize+(ckSize/2) - advance, winH/2 + winH/3);
		}
		
	}
	fill(0)
}
//Spacebar
function keyTyped(){
	if(key === ' '){
		if (PosY >= (Number(winH/2 - persH - chunkHeight()))){
			jump = jumpH;
		}
	}
}