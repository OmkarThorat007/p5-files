var rows = 100;
var cols = 100;
var w, h;
var grid = new Array();
var start;
var end;
var discovered = [];
var path = [];

class Queue 
{ 
    // Array is used to implement a Queue 
    constructor() 
    { 
        this.items = [];
    } 
    // enqueue function 
	enqueue(element) 
	{     
	    // adding element to the queue 
	    this.items.push(element); 
	} 
    // dequeue function 
	dequeue() 
	{ 
	    // removing element from the queue ,else returns underflow when called on empty queue 
	    if(this.isEmpty()) 
	        return "Underflow"; 
	    return this.items.shift(); 
	} 
    // isEmpty function 
	isEmpty() 
	{ 
	    // return true if the queue is empty. 
	    return this.items.length == 0; 
	} 
	len(){
		return this.items.length;
	}

}


function Spot(i, j){
	this.i = i;
	this.j = j;
	this.wall = false;
	this.neighbours = [];
	this.prev = undefined;
	if(random(1) < 0.15){
		this.wall = true;
	}
	this.show = function(color){
		fill(color);
		if(this.wall == true)
			fill(0);
		noStroke();
		rect(this.i * w, this.j*h,w-1, h-1);
	}
	this.addneighbours = function(grid){
		var i = this.i;
		var j = this.j;
		if(i < cols - 1){
			this.neighbours.push(grid[i + 1][j]);
		}
		if(i > 0){
			this.neighbours.push(grid[i - 1][j]);
		}
		if(j < rows - 1){
			this.neighbours.push(grid[i][j + 1]);
		}
		if(j > 0){
			this.neighbours.push(grid[i][j - 1]);
		}
		if(i > 0 && j > 0){
			if(grid[i-1][j].wall == false || grid[i][j-1].wall == false){
					this.neighbours.push(grid[i-1][j-1]);
			}
		}
		if(i < cols-1 && j < rows-1){
			//add diagonal neighbour only if i+1, j and i, j+1 are not walls
			if(grid[i+1][j].wall == false || grid[i][j+1].wall == false){
				this.neighbours.push(grid[i+1][j+1]);
			}
		}
		if(i > 0 && j < rows-1){
			if(grid[i-1][j].wall == false || grid[i][j+1].wall == false){
				this.neighbours.push(grid[i-1][j+1]);
			}
		}
		if(i < cols-1 && j > 0){
			if(grid[i+1][j].wall == false || grid[i][j-1].wall == false){
				this.neighbours.push(grid[i+1][j-1]);
			}
		}

}
}

var queue = new Queue();
function setup(){
	createCanvas(1000,700);
	w = width / cols;
	h = height / rows;
	for(var i =0 ; i < cols; i++){
		grid[i] = new Array(rows);
	}
	for(var i =0; i < cols; i++){
		for(j = 0; j < rows; j++){
			grid[i][j] = new Spot(i, j);
		}
	}
	//adding neighbours of every spot
	for(var i =0; i < cols; i++){
		for(var j =0; j < rows; j++){
			grid[i][j].addneighbours(grid);
		}
	}
	start = grid[cols/2][rows/2];
	end = grid[cols-1][rows-1];
	//start and end cannot be wall cells
	start.wall = false;
	end.wall = false;
	//initialising the queue to contain the first cell/spot
	queue.enqueue(start);
	discovered.push(start);
}


function draw(){
	if(queue.isEmpty() == false){
		var current = queue.dequeue();
		if(current == end){
			console.log("done");
			noLoop();
		}
		var neighbours = current.neighbours;
		for(var i = 0; i < neighbours.length; i++){
			if(discovered.includes(neighbours[i]) == false && !neighbours[i].wall){
				discovered.push(neighbours[i]);
				neighbours[i].prev = current;
				queue.enqueue(neighbours[i]);
			}
		}
	}
	else{
		//end or no solution
		console.log("end/no solution");
		noLoop();
		return;
	}

	//showing the path 
	path = [];
 	var temp = current;
 	path.push(temp);
 	while(temp.prev){
 		path.push(temp.prev);
 		temp = temp.prev;
 	}

	background(0);
	for(var i =0; i < cols; i++){
		for(var j = 0;j <rows; j++){
			grid[i][j].show(color(255));
		}
	}
	for(var i = 0; i < queue.len(); i++){
		queue.items[i].show(color(255, 0,0));
	}
	for(var i = 0; i < path.length; i++){
	 	path[i].show(color(0,0,255));
	}

}