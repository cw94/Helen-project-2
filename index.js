let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use('/', express.static('Project'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 2000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//------------------------------Initialize socket.io--------------------------------------------------------------
let io = require('socket.io').listen(server);

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'data' from this client
    socket.on('data', function(data) {
        console.log("Received: 'data' " + data);
        
        //Send received data from this client to all other clients, NOT including this client
        //Choice: io.sockets.emit('data', data);--Send date to all clients including this client
        //socket.emit('data', data);--Send the data to just this client
        socket.broadcast.emit('data', data);        
    });

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});
//-----------------------------------------------------------------------------------------------------------------

//--------------------------------Database Operation---------------------------------------------------------------
//DB initial code
let Datastore = require('nedb');
let db = new Datastore('seas.db');
db.loadDatabase();

let seaitems = [];

app.post('/loadsea', (req, res)=>{
    console.log(req.body);
    let obj = {
        name: req.body.seaname,
        size: req.body.seasize,
        deep: req.body.seadeep
    }

//insert data into database
    db.insert(obj, (err, newDocs)=>{
        if(err) {
            res.json({task: "task failed"});
        }else{
            res.json({task:"success"});
        }
    })
    
})

app.get('/seas', (req, res)=>{
    db.find({}, (err, docs)=>{
        if(err){
            res.json({task: "task failed"}); 
        }else{
            let obj = {data: docs};
            res.json(obj);
        }
    })
})

app.get('/clearDB', (req, res)=>{
    db.remove({}, {multi: true}, (err, numRemoved)=>{
        if(err){
            res.json({task: "task failed"}); 
        }else{
            res.json({DB: "Cleared"});
        }
    })
})


