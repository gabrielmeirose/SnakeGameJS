
const highscore = document.getElementById('highscore')
const scoreDisplay = document.getElementById('score')
const retry = document.getElementById('retry')
const text = document.getElementById('text')


let foodIcon        = '🍎'
let snakeIcon       = '🐍'
let snakeBodyIcon   = '🟢'

let score = 0


// Character options

let options = {
    cat:['🐈','🐾','🐟'],
    dog:['🐕','🦴','🍖'],
    snake:['🐍','🟢','🍎'],
    //singer:['🧙‍♂️‍','🧟‍♂️','🦴']
    thief:['🕵️','👮','💰']
}

// Game object (saved in local storage)

let game = {
    character: options.snake,
    highscore: 0
}


// Player object

let snake = {
    position: [3,3],   // head position
    direction: [-1,0], // x y
    size: 1,
    speed: 500,  // milliseconds of each 'turn'

    body: [], // Snake body, excluding head

    move: function() {
        this.body.push([this.position[0],this.position[1]])

        if(this.body.length > this.size)
            this.body.shift()

        this.position[0] += this.direction[0]
        this.position[1] += this.direction[1]


        // If out of grid

        if(this.position[0] < 0 || this.position[0] > 5 || this.position[1] < 0 || this.position[1] > 5){
            gameOver()
        }

        else{
            for(let i=0; i<this.body.length;i++)
                if(this.body[i][0] == this.position[0] && this.body[i][1] == this.position[1]){
                    gameOver()
            }
        }
    },

    eat: function(){
        console.log('eat')
        snake.size += 1
        snake.speed /= 1.1
    
        score += 1
        updateScore()

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


// Score and hiscore functions

let updateScore = function(){
    scoreDisplay.innerHTML = '🍎 ' + score
}

let updateHighscore = function(){
    if(score > game.highscore)
        game.highscore = score

    highscore.innerHTML = '⭐ ' + game.highscore
}


// Grid Functions

let getGridPosition = function(x,y){
    return document.getElementById("pos"+x+"-"+y)
}

let changeGrid = function(pos, icon){
    getGridPosition(pos[0],pos[1]).innerHTML = icon
}

let clearGrid = function(){
    for(let i=0; i<6; i++){
        for(let j=0; j<6; j++){
            getGridPosition(i, j).innerHTML = ''
        }
    }
}


// Game Over Functions

let gameOver = function(){

    clearInterval(timer)
    document.removeEventListener("keydown", input)

    retry.style = "visibility: visible"
    text.innerHTML = "Game Over!"
    text.style = "color:rgb(187, 70, 70)"

    document.getElementById('game_grid').style = 'border: 2px red solid'

    updateHighscore()

    saveGame()

}


// Player Input

let input = function(event){
    //console.log(event.key)

    if(event.key.toLowerCase() == "w")
        snake.direction = [-1,0]
    
    if(event.key.toLowerCase() == "a")
        snake.direction = [0,-1]

    if(event.key.toLowerCase() == "s")
        snake.direction = [1,0]

    if(event.key.toLowerCase() == "d")
        snake.direction = [0,1]

}

let changeCharacter = function(option){
    foodIcon = option[2]
    snakeIcon = option[0]
    snakeBodyIcon = option[1]

    game.character = option
}


// Passing turns

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


// Saving and loading game score and character

let saveGame = function(){
    let save = JSON.stringify(game)
    localStorage.setItem('save', save)
}

let loadGame = function(){
    if(localStorage.getItem('save'))
        game = JSON.parse(localStorage.getItem('save'))

    highscore.innerHTML = '⭐ ' + game.highscore
}


// Start Game

document.addEventListener("keydown", input)

loadGame()

changeCharacter(game.character)

addFruit()

let timer = setInterval(passTurn, snake.speed)