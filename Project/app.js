let button;
let button2;
let button3;
let button4;
let picchange1 = ["pic5.jpg", "pic6.jpg", "pic1.jpg"];
let picchange2 = ["pic8.jpg", "pic9.jpg", "pic2.jpg"];
let picchange3 = ["pic11.jpg", "pic12.jpg", "pic3.jpg"];
let textchange = ["Mysterious Undersea World", "An ocean is a body of water that composes much of a planet's hydrosphere. On Earth, an ocean is one of the major conventional divisions of the World Ocean. These are, in descending order by area, the Pacific, Atlantic, Indian, Southern (Antarctic), and Arctic Oceans. The phrases the ocean or the sea used without specification refer to the interconnected body of salt water covering the majority of the Earth's surface.", "As the world ocean is the principal component of Earth's hydrosphere, it is integral to life, forms part of the carbon cycle, and influences climate and weather patterns. The World Ocean is the habitat of 230,000 known species, but because much of it is unexplored, the number of species that exist in the ocean is much larger, possibly over two million. The origin of Earth's oceans is unknown; oceans are thought to have formed in the Hadean eon and may have been the cause for the emergence of life."];
let num1 = 0;
let num2 = 0;
let i = 0;
let j = 0;

//press "More Views" button, you will see 3 pictures change
button = document.getElementById('button');

button.addEventListener("click", changepic);

function changepic(){
    document.getElementById('img1').src = picchange1[num1];
    document.getElementById('img2').src = picchange2[num1];
    document.getElementById('img3').src = picchange3[num1];
    num1 = (num1+1)%3;
}

//press "Deep Show" button, you will see differen instruction of Oceans 
button2 = document.getElementById('button2');

button2.addEventListener("click", changeword);

function changeword(){
    document.getElementById('keyword').innerText = textchange[num2];
    num2 = (num2+1)%3;
}

//connect to ocean.json file
window.addEventListener('load', function(){
    console.log('page is loaded');
    fetch("ocean.json")
    .then(Response => Response.json())
    .then(data => {
        console.log(data);

//show 4 biggest oceans from the world wide map
        let str = ["ocean_name1","ocean_name2","ocean_name3","ocean_name4"];
        button3 = document.getElementById('button3');
        button3.addEventListener("click", function(){
            for (j=0; j<4; j++) {
                document.getElementById(str[j]).innerHTML=''
            }
            document.getElementById(str[i]).innerHTML = data.oceans[i].name;
            i = (i+1)%4;
        });  

//show 141 seas in the world ramdomly
        button4 = document.getElementById('button4');
        button4.addEventListener("click", function() {
            let a = Math.floor(Math.random() * data.seas.length);
            console.log(data.seas[a].name);
            document.getElementById('sea_name').innerHTML = data.seas[a].name;
        });

        oceanData = data;
    })

//Post data through fetch
    document.getElementById('loadsea').addEventListener('click', ()=>{
        let seaname = document.getElementById('seaname').value;
        let seasize = document.getElementById('seasize').value;
        let seadeep = document.getElementById('seadeep').value;
        console.log(seaname);
        let obj = {"seaname": seaname, "seasize": seasize, "seadeep": seadeep};
        let jsonData = JSON.stringify(obj);

        fetch('/loadsea', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: jsonData
        })
        .then(response => response.json())
        .then(data => {console.log(data)});
    })

//Show seas button
    document.getElementById('showsea').addEventListener('click', ()=>{
         fetch('/seas')
         .then(response => response.json())
         .then(data => {
             for(let i=0;i<data.data.length;i++) {
                 let string = "Name:" + data.data[i].name + ", " + "  " + "Size:" + data.data[i].size + "KM2" + ", " + "  " + "Deep:" + data.data[i].deep + "M average";
                 let elt = document.createElement('p');
                 elt.innerHTML = string;
                 document.getElementById('sealist').appendChild(elt);
             }
         })
    })

//Clear Database when click button
    document.getElementById('clearDB').addEventListener('click', ()=>{
        fetch('/clearDB')
        .then(response => response.json())
        .then(data => {console.log(data)});
    })
})

//------------------------------Socket io------------------------------------------------------
//Open and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', function() {
    console.log("Connected");
});

function setup() {
    createCanvas(500, 500);
    background(0);

    //Listen for messages named 'data' from the server
    socket.on('data', function(obj) {
        console.log(obj);
        newdraw(obj);
    });
}

//Other clients will always receive updated mouse position, so they will only draw triangle like below
function newdraw(pos) {
    noStroke();
    fill(255, 0, 150);
    //square(pos.x, pos.y, 30);
    triangle(pos.x, pos.y, pos.x-10, pos.y+15, pos.x+10, pos.y+15);
}

function draw() {
    //Grab mouse position
    let mousePos = { x: mouseX, y: mouseY };
    //Send mouse position to the server
    socket.emit('data', mousePos);

    //This client who provide mouse postion will not receive server feedback, so it only draw ellipse like below
    noStroke();
    fill(250);
    ellipse(mouseX, mouseY, 20, 20);    
}

//---------------------P5.JS  show  name,size and average deep of 4 biggest oceans----------------------------
// let x = 100;
// let y = 50;
// let x1 = 0;
// let y1 = 200;
// let x2 = 50;
// let y2 = 150;
// let x3 = 100;
// let y3 = 250;

// let xspeed = 2;
// let yspeed = 1;
// let x1speed = 2;
// let y1speed = 2;
// let x2speed = 3;
// let y2speed = 2;
// let x3speed = 4;
// let y3speed = 2;

// let oceanData;
// let a;
// let namepositionX = [60, 60, 270, 270];
// let namepositionY = [125, 335, 125, 335];
// let sizepositionX = [60, 60, 270, 270];
// let sizepositionY = [150, 360, 150, 360];
// let deeppositionX = [60, 60, 270, 270];
// let deeppositionY = [175, 385, 175, 385];

// function setup() {
//     createCanvas(480, 500);
// }

// function draw() {
//     background(0, 200, 250);
//     //4 bubbles move ramdonly
//     xspeed = bounce(x, width, 0, xspeed);
//     yspeed = bounce(y, height, 0, yspeed);
//     x1speed = bounce(x1, width, 0, x1speed);
//     y1speed = bounce(y1, height, 0, y1speed);
//     x2speed = bounce(x2, width, 0, x2speed);
//     y2speed = bounce(y2, height, 0, y2speed);
//     x3speed = bounce(x3, width, 0, x3speed);
//     y3speed = bounce(y3, height, 0, y3speed);
  
//     x += xspeed;
//     y += yspeed;
//     x1 += x1speed;
//     y1 += y1speed;
//     x2 += x2speed;
//     y2 += y2speed;
//     x3 += x3speed;
//     y3 += y3speed;
  
//     noStroke();
//     fill(50, 200, 100);
//     ellipse(x, y, 50, 50);
//     fill(200, 200, 100);
//     ellipse(x1, y1, 50, 50);
//     fill(0, 0, 255);
//     ellipse(x2, y2, 50, 50);
//     fill(250, 255, 200);
//     ellipse(x3, y3, 50, 50);

//     //print 4 oceans details in the p5js
//     if(oceanData){
//         textSize(25); 
//         textFont("Comic Sans MS");
//         for(a=0; a<4; a++){
//            text(oceanData.oceans[a].name, namepositionX[a], namepositionY[a]);
//            text(oceanData.oceans[a].size, sizepositionX[a], sizepositionY[a]);
//            text(oceanData.oceans[a].avagdeep, deeppositionX[a], deeppositionY[a]);
//         }
//     }
// }  

// //bubbles change direction when meet boundary
// function bounce(a, top, bottom, speed) {
//     if(a > top || a < bottom){
//       speed *= -1; 
//     }
//     return speed;
// }