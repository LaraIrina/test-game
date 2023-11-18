//Setting up project 

const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d') //access content
// Make sure canvas takes up the whole screen, also set margin to 0 in .html
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Make sure canvas takes up whole screen, also set margin to 0 in .html
canvas.width = window.innerWidth
canvas.height = window.innerHeight

//Constant gravity to make player fall down faster the closer it comes to ground
const gravity = .5

//Player creation including gravity of falling
class Player {
    //whenever player is created this method constructs it
    constructor({x, y, image, width, height}){
        this.position = {
            x: 100,
            y: 100 //pushes player down when we add positive numbers to position in canvas it falls down
        }
        //velocity for gravity whilst falling down
        this.velocity  = {
            x: 0,
            y: 0
        }
        this.image = image
        this.width = width
        this.height = height
        // this.width = 30
        // this.height = 30
    }
    //method to define what player looks like and draw it
    draw(){
        // c.fillStyle = 'red' //set color of player
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    //alter players properties as we call this function
    update(){
        this.position.x += this.velocity.x //change position x-axis
        this.position.y += this.velocity.y //change position y-axis
        this.draw() //draw player again
        //only let gravity hit when player is on top position
        if (this.position.y + this.height +this.velocity.y <= canvas.height)
            this.velocity.y += gravity //falling down faster the closer to ground
    }
}

// Platform creation 
class Platform {
    constructor({x, y, image, width, height}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = width
        this.height = height

    }
    draw(){
          //c.fillStyle = "blue" //set color of player
          //c.fillRect(this.position.x, this.position.y, this.width, this.height)
         c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}

// Platform generic objects aka background 
class GenericObjects {
    constructor({ x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }
    draw() {
        //c.fillStyle = "blue" //set color of player
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}
//Function to create images
function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}

//Create Platform
let platform_offset = 30
let platformImageSrc = "./img/platform-small.png"
let platformImage = createImage(platformImageSrc)

let platforms = [
    new Platform({x: -10, y: 470+platform_offset, image:platformImage, width: 500, height:150}),
    new Platform({x: 470, y: 470+platform_offset, image:platformImage, width: 500, height:150}),
];
//Create Character
let characterImageSrc = "./img/character.png"
let player = new Player({x: -10, y: 470, image:createImage(characterImageSrc), width: 320, height:180})

//Create Background
let backgroundImageSrc = "./img/background-3.png"
let background = new GenericObjects({
    x: -1,
    y: -1,
    image: createImage(backgroundImageSrc)
})
let hillsImageSrc = "./img/hills.png"
let hills = new GenericObjects({
    x: -1,
    y: -1,
    image: createImage(hillsImageSrc)
})

//Constant for key presses
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
//Create Win Scenario: As soon as player moved a certain amount of pixels
let scrollOffset = 0
let pixelsToWin = 2000

//Function to reset game when player falls in death pit
function init(){

//Create Platform
 platform_offset = 30
 platformImageSrc = "./img/platform-small.png"
 platformImage = createImage(platformImageSrc)

 platforms = [
    new Platform({x: -10, y: 470+platform_offset, image:platformImage, width: 500, height:150}),
    new Platform({x: 470, y: 470+platform_offset, image:platformImage, width: 500, height:150}),
];
//Create Character
 characterImageSrc = "./img/character.png"
 player = new Player({x: -10, y: 470, image:createImage(characterImageSrc), width: 320, height:180})

//Create Background
 backgroundImageSrc = "./img/background-3.png"
 background = new GenericObjects({
    x: -1,
    y: -1,
    image: createImage(backgroundImageSrc)
})
 hillsImageSrc = "./img/hills.png"
 hills = new GenericObjects({
    x: -1,
    y: -1,
    image: createImage(hillsImageSrc)
})

//Create Win Scenario: As soon as player moved a certain amount of pixels
 scrollOffset = 0
 pixelsToWin = 2000
}
//Function to add animation to game
function animate(){
    requestAnimationFrame(animate) //calls animate function over and over again
    c.fillStyle = "white"
    c.fillRect(0, 0 ,canvas.width, canvas.height) //clears canvas and removes 'old' player so that it doesn't draw a line after itself
    background.draw()
    hills.draw()

    platforms.forEach(platform => {
        platform.draw() //draw platform
    })
    player.update() //updates player properties

//Movement of Player up to certain point (400), after that scroll the background
    if (keys.right.pressed && player.position.x < 400){
        player.velocity.x = 5 //add movement to right when key is pressed
    }
    else if (keys.left.pressed && player.position.x > 100){
        player.velocity.x = -5 //movement to left side
    }
    //Monitor edges where player doesn't move anymore but platforms do
    else{
        player.velocity.x = 0 //stop moving when key is released

        if(keys.right.pressed){
            platforms.forEach(platform => {
                platform.position.x -= 5 //move platform to left instead of player to right
                scrollOffset += 5 //add pixels to the moved pixsels for win
            })
            background.position.x -= 3 //slower to create a parallax scroll
            hills.position.x -= 3 //slower to create a parallax scroll

        }
        else if(keys.left.pressed){
            platforms.forEach(platform => {
                platform.position.x += 5 //move platform to left instead of player to right
                scrollOffset -= 5 //remove pixels to the moved pixsels for win
            })  
            background.position.x += 3 //slower to create a parallax scroll
            hills.position.x += 3 //slower to create a parallax scroll

      
        }
    } 
    
//Collision Detection with Platform
    const offset_x = 150 //to make up for characters width
    const offset_y = 60 //to make up for characters height
    platforms.forEach(platform => {
    if (
        player.position.y + player.height <= platform.position.y+offset_y && player.position.y + player.height + player.velocity.y >= platform.position.y+offset_y && player.position.x + player.width >= platform.position.x+offset_x && player.position.x <= platform.position.x-offset_x + platform.width){
        player.velocity.y =  0 // stop moving when collision detected and player hits 'floor'
    }})
//Condition to win
    if(scrollOffset > pixelsToWin){
        console.log("You win!")
    }
//Condition to loose
if(player.position.y > canvas.height){
    console.log("You loose!")
    init() //reset everything
}
}
animate() //call animate function

//Listen for key presses for movements
addEventListener('keydown', ({keyCode})=>{
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            break;
        case 83:
            console.log('down')
            break;
        case 68:
                console.log('right')
                keys.right.pressed = true
                break;
        case 87:
                console.log('up')
                player.velocity.y -= 20 //minus as added velocity makes it fall down
                break;
        default:
            break;
    }
})

//Listen for key releases to stop moving when necessary
addEventListener('keyup', ({keyCode})=>{
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            break;
        case 83:
            console.log('down')
            break;
        case 68:
                console.log('right')
                keys.right.pressed = false
                break;
        case 87:
                console.log('up')
                break;
        default:
            break;
    }
})
