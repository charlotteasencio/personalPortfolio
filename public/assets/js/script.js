
openFullMenu = () => {
    document.getElementById('fullMenu').classList.toggle("hidden");
    document.getElementById('closeButton').classList.toggle('hidden');
    document.getElementById('openButton').classList.toggle('hidden');
}

scrollToAbout = (className) => {
    const elementList = document.querySelectorAll('.'  + className);
    const element = elementList[0] 
    element.scrollIntoView({ behavior: 'smooth' })
    openFullMenu()
  }

scrollToTop = (className) => {
    const elementList = document.querySelectorAll('.'  + className);
    const element = elementList[0] 
    element.scrollIntoView({ behavior: 'smooth' })
}
const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 80;

const c = canvas.getContext('2d');

let colors = ["#dc143c", "#75afa8", "#d9b449", "#008080"];

const headerPDiv = document.getElementById('heading3')

headerPDiv.style.height = canvas.height / 4;
headerPDiv.style.width = canvas.width / 3;

let rectangle = headerPDiv.getBoundingClientRect()

console.log(rectangle)


addEventListener('resize', () => {
    canvas.height = innerHeight - 80;
    canvas.width = innerWidth;

    rectangle = headerPDiv.getBoundingClientRect()
    init();
})

function findDistance(x1, y1, x2, y2) {
    let distance1 = x2-x1
    let distance2 = y2-y1
        return Math.sqrt((Math.pow(distance1, 2)) + (Math.pow(distance2, 2)))
    }
    
    //rotate on the angle between the two center points of particles so you can use the two deminsions
    function rotate(velocity, angle) {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };
    
        return rotatedVelocities;
    }
    
    function collision(particle, otherParticle) {

        const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
        const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
    
        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;
    
        // Prevent accidental overlap of particles
            //Diff in velocity and distance of the two particles that are being passed through will only react when this is = 0
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    
            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
    
            const m1 = particle.mass;
            const m2 = otherParticle.mass;
    
            const u1 = rotate(particle.velocity, angle);
            const u2 = rotate(otherParticle.velocity, angle);
    
            //ONE-DIMENSIONAL NEWTONIAN EQUATION: 
              //velocity after collision = (mass1 - mass 2) / (mass1 + mass2) * velocity1 before collision + (2 * mass2) / (mass1 + mass2) * velocity2 before collision
            
            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
    
            // Final velocity after rotating axis back to original location
            const vFinal1 = rotate(v1, -angle);
            const vFinal2 = rotate(v2, -angle);
    
            // Swap particle velocities for realistic bounce effect
            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;
    
            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
        }
    }

//declare object
function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y; 
    this.velocity = {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;

    this.update = circleArray => {
    
        this.draw()

        for (let i = 0; i < circleArray.length; i++) {
            //way to not included itself
            if (this === circleArray[i]) continue;
            if(findDistance(this.x,this.y, circleArray[i].x, circleArray[i].y) - this.radius * 2 < 0) {
                collision(this, circleArray[i]);
            }
        }

        //keep things from going off sides
        if(this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
            this.velocity.x = -this.velocity.x;
        }

        if(this.y - this.radius <= 0 || this.y + this.radius >= (innerHeight - 80)) {
            this.velocity.y = -this.velocity.y;
        }

        if(this.x + this.radius > rectangle.left && this.x - this.radius < rectangle.right && this.y + this.radius + 20 > rectangle.top && this.y - this.radius - 20 < rectangle.bottom) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = -this.velocity.y;
        }
        //adds the velocity to the x and y value to make things move
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    // //define the circles that are drawn
     this.draw = function() {
        c.save()
         c.beginPath();
         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
         c.shadowColor = '#e3eaef'
         c.shadowBlur = 20
         c.fillStyle = this.color;
         c.fill();
         c.restore();
     }

}

// Objects
function Planet(x, y, radius, color,  velocity, distanceCenter){
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.radians = Math.random() * Math.PI *2 //to give them a radom starting point along the cirle, using a number between -1 and 1 will give them all the same point
    this.velocity = velocity
    this.distanceCenter = distanceCenter


    this.update = () => {

        this.radians += this.velocity;
        //using cos and sin gives circular motion
        this.x = x + Math.cos(this.radians) * distanceCenter
        this.y = y + Math.sin(this.radians) * distanceCenter
        this.draw()
    }

    this.draw = () => {
         c.beginPath()
         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
         c.fillStyle = this.color
         c.fill()
         c.closePath()
    }
}

function Sun(x, y, radius, color){
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color

    this.update = function() {

        this.draw()
    }

    this.draw = function() {
         c.beginPath()
         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
         c.fillStyle = this.color
         c.fill()
         c.closePath()

    }
}

function Orbit(x, y, radius, color){
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color

    this.update = function() {

        this.draw()
    }

    this.draw = function() {
         c.beginPath()
         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
         //c.fillStyle = this.color
         c.stroke()

    }
}

// Implementation
let sun;

let planet1;
let planet2;
let planet3;
let planet4;
let planet5;
let planet6;
let planet7;
let planet8;

let orbit1;
let orbit2;
let orbit3;
let orbit4;
let orbit5;
let orbit6;
let orbit7;
let orbit8;

let circleArray;

function init() {
    const allX = canvas.width / 2
    const allY = canvas.height / 2

    const planet1dist = canvas.width / 15
    const planet2dist = canvas.width / 11
    const planet3dist = canvas.width / 7.6
    const planet4dist = canvas.width / 5.8
    const planet5dist = canvas.width / 4.4
    const planet6dist = canvas.width / 3.2
    const planet7dist = canvas.width / 2.5
    const planet8dist = canvas.width / 2.2

    let colors = ["#dc143c", "#75afa8", "#d9b449", "#008080"];

    if(canvas.width >= 800) {

    sun = new Sun(allX, allY, 35, colors[2])

    planet1 = new Planet(allX, allY, 10, colors[0], 0.01607, planet1dist)
    planet2 = new Planet(allX, allY, 13, colors[1], 0.01174, planet2dist)
    planet3 = new Planet(allX, allY, 17, colors[2], 0.01, planet3dist)
    planet4 = new Planet(allX, allY, 15, colors[3], 0.00802, planet4dist)
    planet5 = new Planet(allX, allY, 28, colors[0], 0.00434, planet5dist)
    planet6 = new Planet(allX, allY, 36, colors[1], 0.00323, planet6dist)
    planet7 = new Planet(allX, allY, 32, colors[2], 0.00228, planet7dist)
    planet8 = new Planet(allX, allY, 28, colors[3], 0.00182, planet8dist)

    } else if (canvas.width < 800 && canvas.width > 600) {
        sun = new Sun(allX, allY, 20, colors[2])

        planet1 = new Planet(allX, allY, 7, colors[0], 0.01607, planet1dist)
        planet2 = new Planet(allX, allY, 10, colors[1], 0.01174, planet2dist)
        planet3 = new Planet(allX, allY, 14, colors[2], 0.01, planet3dist)
        planet4 = new Planet(allX, allY, 12, colors[3], 0.00802, planet4dist)
        planet5 = new Planet(allX, allY, 20, colors[0], 0.00434, planet5dist)
        planet6 = new Planet(allX, allY, 26, colors[1], 0.00323, planet6dist)
        planet7 = new Planet(allX, allY, 23, colors[2], 0.00228, planet7dist)
        planet8 = new Planet(allX, allY, 20, colors[3], 0.00182, planet8dist)
    } else if(canvas.width <= 600) {
        sun = new Sun(allX, allY, 12, colors[2])

        planet1 = new Planet(allX, allY, 2, colors[0], 0.01607, planet1dist)
        planet2 = new Planet(allX, allY, 4, colors[1], 0.01174, planet2dist)
        planet3 = new Planet(allX, allY, 6, colors[2], 0.01, planet3dist)
        planet4 = new Planet(allX, allY, 8.5, colors[3], 0.00802, planet4dist)
        planet5 = new Planet(allX, allY, 11, colors[0], 0.00434, planet5dist)
        planet6 = new Planet(allX, allY, 13, colors[1], 0.00323, planet6dist)
        planet7 = new Planet(allX, allY, 14.5, colors[2], 0.00228, planet7dist)
        planet8 = new Planet(allX, allY, 11, colors[3], 0.00182, planet8dist)
    }

    orbit1 = new Orbit(allX, allY, planet1dist, "black")
    orbit2 = new Orbit(allX, allY, planet2dist, "black")
    orbit3 = new Orbit(allX, allY, planet3dist, "black")
    orbit4 = new Orbit(allX, allY, planet4dist, "black")
    orbit5 = new Orbit(allX, allY, planet5dist, "black")
    orbit6 = new Orbit(allX, allY, planet6dist, "black")
    orbit7 = new Orbit(allX, allY, planet7dist, "black")
    orbit8 = new Orbit(allX, allY, planet8dist, "black")

    circleArray = [];

    function makeCircles(circlesAmount) {
        for (let i = 0; i < circlesAmount; i++) {
            const radius = 2
            let x =  Math.floor(Math.random() * (canvas.width-radius - radius + 1) + radius);
            let y =  Math.floor(Math.random() * (canvas.height-radius - radius + 1) + radius);
            let color = "white"//colors[Math.floor(Math.random() * colors.length)];

            if(i !== 0) {

                for (let j = 0; j < circleArray.length; j++) {
                    if(findDistance(x,y, circleArray[j].x, circleArray[j].y) - radius * 2 < 0) {
                        //if they are then generate new x and y 
                        x = Math.floor(Math.random() * (canvas.width-radius - radius + 1) + radius);
                        y = Math.floor(Math.random() * (canvas.height-(radius) - radius + 1) + radius);

                        //start the loop over to make sure new particles generated aren't overlapping
                        j = -1
                    }
                }

                for(let k=0; k < circleArray.length; k++) {
                    if(circleArray[k].x + circleArray[k].radius * 2 >= rectangle.left && circleArray[k].x - circleArray[k].radius * 2 <= rectangle.right 
                        && circleArray[k].y - circleArray[k].radius * 2 <= rectangle.bottom && circleArray[k].y + circleArray[k].radius * 2 >= rectangle.top){
                            circleArray[k].x = Math.floor(Math.random() * (canvas.width - radius - radius + 1) + radius)
                            circleArray[k].y = Math.floor(Math.random() * (canvas.height - radius - radius + 1) + radius)
                        
                        k = -1
                    }
                }
            }

            //instantiating a new object, in this case a circle, and pushing it to an array at the same time used in place of [var circle = new Circle(x, y, dx, dy)]
            circleArray.push(new Circle(x, y, radius, color));
        }
    }

    if (canvas.height < 500 || canvas.width < 700) {
        makeCircles(30)
    } else if (canvas.height < 800 || canvas.width < 900) {
        makeCircles(60)
    } else {
        makeCircles(120)
    }

}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)

    // c.fillStyle = backgroundGradient
    // c.fillRect(0, 0, canvas.width, canvas.height)


    c.clearRect(0, 0, canvas.width, canvas.height)

     //draw the circles on the screen
     circleArray.forEach(circle => {
        circle.update(circleArray)
    })

    sun.update();

    orbit1.update();
    orbit2.update();
    orbit3.update();
    orbit4.update();
    orbit5.update();
    orbit6.update();
    orbit7.update();
    orbit8.update();

    planet1.update();
    planet2.update();
    planet3.update();
    planet4.update();
    planet5.update();
    planet6.update();
    planet7.update();
    planet8.update();

    // c.fillStyle = grd;
    // c.fillRect(0, 0, canvas.width, canvas.height)
}

init()
animate()