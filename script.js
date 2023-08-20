
let highscore = 0

let foodIcon        = '🍎'
let snakeIcon       = '🐍'
let snakeBodyIcon   = '🟢'

// Other options

let options = {
    cat:['🐈','🐾','🐟'],
    dog:['🐕','🦴','🍖'],
    snake:['🐍','🟢','🍎'],
    singer:['🧙‍♂️‍','🧟‍♂️','🦴']
}


// Player object

let snake = {
    position: [3,3],
    direction: [-1,0], // x y
    size: 1,
    speed: 500,  // milliseconds of each 'turn'

    body: [], // Snake body, EXCLUDING head (position)

    move: function() {
        this.body.push([this.position[0],this.position[1]])

        if(this.body.length > this.size)
            this.body.shift()

        this.position[0] += this.direction[0]
        this.position[1] += this.direction[1]

        //console.log('POSITION:',this.position)
        //console.log('BODY:',this.body)

        // If out of grid

        if(this.position[0] < 0 || this.position[0] > 5 || this.position[1] < 0 || this.position[1] > 5){
            clearInterval(timer)
            document.removeEventListener("keydown", input)
            showGameOver()
        }

        else{
            for(let i=0; i<this.body.length;i++)
                if(this.body[i][0] == this.position[0] && this.body[i][1] == this.position[1]){
                    clearInterval(timer)
                    document.removeEventListener("keydown", input)
                    showGameOver()
            }
        }
    },

    eat: function(){
        console.log('eat')
        snake.size += 1
        snake.speed /= 1.1
    
        // Update Timer
        clearInterval(timer)
        timer = setInterval(passTurn, this.speed)
    },

    debug: function(){
        console.log(typeof snake)
        console.log(typeof this.position)
        console.log(typeof this.position[0])
    },

    display: function(){
        //console.log('display snake')

        changeGrid(this.position, snakeIcon)

        for(let i=0; i<this.body.length; i++){
            changeGrid(this.body[i], snakeBodyIcon)
        }
    }

}


// Food Array

let foodArray = [] 

let addFruit = function(){
    let pos = [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)]
    foodArray.push(pos)
}


// Grid Functions

let changeGrid = function(pos, icon){
    document.getElementById("pos"+pos[0]+"-"+pos[1]).innerHTML = icon
}

let clearGrid = function(){
    for(let i=0; i<6; i++){
        for(let j=0; j<6; j++){
            document.getElementById("pos"+i+"-"+j).innerHTML = ''
        }
    }
}


// Game Over Functions

let hideGameOver = function(){
    document.getElementById("retry").style = "visibility: hidden"
    document.getElementById("text").innerHTML = "WASD to Move"
    document.getElementById("text").style = "color:gray"

}

let showGameOver = function(){
    document.getElementById("retry").style = "visibility: visible"
    document.getElementById("text").innerHTML = "Game Over!"
    document.getElementById("text").style = "color:rgb(187, 70, 70)"

}



// Player Input

let input = function(event){
    //console.log(event.key)

    if(event.key == "w")
        snake.direction = [-1,0]
    
    if(event.key == "a")
        snake.direction = [0,-1]

    if(event.key == "s")
        snake.direction = [1,0]

    if(event.key == "d")
        snake.direction = [0,1]

}

let changeCharacter = function(option){
    console.log('aaaa')
    foodIcon = option[2]
    snakeIcon = option[0]
    snakeBodyIcon = option[1]
}

let passTurn = function(){

    clearGrid()

    snake.move()

    for(let i=0;i<foodArray.length;i++){
        if(foodArray[i][0] == snake.position[0] && foodArray[i][1] == snake.position[1]){
            console.log('EAT')
            snake.eat()
            
            let pos = foodArray.indexOf(snake.position)
            foodArray.splice(pos, 1)

            addFruit()
        }
    }

    for(let i=0; i<foodArray.length; i++)
        changeGrid(foodArray[i],foodIcon)
    

    snake.display()
}

document.addEventListener("keydown", input)


hideGameOver()
addFruit()
let timer = setInterval(passTurn, snake.speed)