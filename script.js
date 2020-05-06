var cols = 100;
var rows = 100;
var w, h;
var path = [];
var grid = new Array();
var nosolution = false;
//var algorithm = document.getElementById("frm1");

//list of nodes that are yet to be evaluated
var openSet =[];
//list of all the nodes that have finished being evaluated
//no need to revisit these nodes
var closedSet = [];
//algorithm finishes either when the openSet becomes empty(i.e there might not be any path)
//or when we arrive at the destination node
var start;
var end;
//constructor function of each Spot/ Cell in the grid
function Spot(i, j){
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.i = i;
	this.j = j;
	this.prev = undefined;
	this.neighbours = [];
	this.wall = false;
	if(random(1) < 0.25){
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

function my_include(set, val){
	//binary search to return boolean if a number exists or not
}

function heuristic(neighbour, end_node) {
	var d = dist(neighbour.i, neighbour.j, end_node.i, end_node.j);
	return d;
	//set return value to 0 so as to do djikstra algorithm
	//return 0;
}

function remove_node(set, element){
	for(var i = set.length - 1; i >=0; i--){
		if(set[i] == element){
			set.splice(i, 1);
		}
	}
}

function setup(){
	createCanvas(1001, 701);
	console.log('A*');
	w = width / cols;
	h = height/ rows;
	//making the grid of spots(cells)
	for(var i =0; i < cols; i++){
		grid[i] = new Array(rows);
	}
	for(var i =0; i < cols; i++){
		for(var j =0; j < rows; j++){
			grid[i][j] = new Spot(i, j);
		}
	}

	//adding neighbours of every spot
	for(var i =0; i < cols; i++){
		for(var j =0; j < rows; j++){
			grid[i][j].addneighbours(grid);
		}
	}
	//setting the start and the end point
	start = grid[0][0];
	end = grid[cols-1][rows-1];
	end.wall = false;
	start.wall = false;
	openSet.push(start);
}

function draw(){
	if (openSet.length > 0){
		//main part of the algorithm
		var lowestIndex = 0;
		for(var i =0; i < openSet.length; i++){
			if(openSet[i].f < openSet[lowestIndex].f){
				lowestIndex = i;
			}
		}
		var current = openSet[lowestIndex];
		if(current == end){
			//Find the path			
			console.log("donee");
			noLoop();
		}
		//remove the current node from the openSet and add it to the closedSet
		remove_node(openSet, current);
		closedSet.push(current);
		//getting the neighbours of the current node
		var neighbours = current.neighbours;
		for(var i=0; i < neighbours.length; i++){
			var neighbour = neighbours[i];
			//change the includes function to myinclude
			if(closedSet.includes(neighbour) == false  && !neighbour.wall){
				var temp_g = current.g +1;
				var newPath = false;
				if(openSet.includes(neighbour)){
					
					if(temp_g < neighbour.g){
						neighbour.g = temp_g;
						newPath = true;
					}
				}
				else{
					neighbour.g = temp_g;
					openSet.push(neighbour);
					newPath = true;
				}
				if(newPath){
					neighbour.h = heuristic(neighbour, end);
					neighbour.f = neighbour.g + neighbour.h;
					neighbour.prev = current;
				}
			}
		}
	}
	else{
		//no solution
		console.log("No solution");
		nosolution = true;
		noLoop();
		return;
	}
	background(0);
	for(var i =0; i < cols; i++){
		for(var j = 0;j <rows; j++){
			grid[i][j].show(color(255));
		}
	}
	for(var i = 0; i < closedSet.length; i++){
		closedSet[i].show(color(255, 0,0));
	}
	for(var i = 0; i < openSet.length; i++){
		openSet[i].show(color(0, 255,0));
	}

 	path = [];
 	var temp = current;
 	path.push(temp);
 	while(temp.prev){
 		path.push(temp.prev);
 		temp = temp.prev;
 	}

	for(var i = 0; i < path.length; i++){
	 	path[i].show(color(0,0,255));
	}
}