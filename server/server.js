/**
 * Nodejs Server entry point
 * @module module name
 * @name file name
 * @fileOverfiew This file includes the basic dependencies and launches an instance of the server
 */
var http = require('http'),
    express = require('express'),
    path = require('path'),
    fs = require('fs-extra'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    cookieParser = require('cookie-parser'),
    compress = require('compression'),
    app = express();
    dbio = require('./dbio.js');

var options = {};
app.set('port', process.env.PORT || 8765);
//app.use(auth);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(compress());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(cookieParser());
var hs = require('./routes');
app.use(express.static(path.join(__dirname, '../')));
//app.use("/uploads", express.static(path.join(__dirname, '../../uploads')));
app.use(hs.init(router, './server/'));
app.use(function(req, res) {
	//console.log("Brijesh");
    res.status(404).send("error");
});

var server = http.createServer(app).listen(app.get('port'), function() {
    console.info('Express server listening on port ' + app.get('port'));
});
io = require('socket.io')(server);
//hs.setIO(io);

var total_user= 0;

/*app.get('/api/:apid' , function(req,res){
    console.log("inside server code...");
    res.end("Hello World");
    console.log("inside the register");
    if (req.params.apid == 'register') {
         // console.log("Req.query " + req.query); 
                dbio.insert(req.query, function(e, dbres) {
                    if (e) {
                            res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    } 
                    else {
                       // socket.emit('pos',dbres);
                        res.status(200).json(dbres);
                    }
                  });
              }
});*/


io.on('connection', function(socket) {

    socket.emit('getDeviceLocation', "geeting all device info...");

    socket.on('updategps', function(msg){
     //alert("dkdkdk");
     console.log("client Id "+ socket.id +"-->  ");
     console.log(msg);
});

    new user(socket);
    console.log("Id of connected User " + total_user++ +"--"+socket.id); 
});


process.on('uncaughtException', function(err) {
  //  console.log("Brijehs error");
    console.error(err.stack);
});
 
function user (soc) {
    var id = soc.id;
    soc.on('disconnect', function(){
    console.log('user ' + total_user-- + 'disconnected  id is', id);
  });

}

var pos = {lat:26.7347, lng: 83.3362,imei:5};
function update() 
{
  /*pos.lat+= 0.001; pos.lng+= 0.001;
  if(pos.lat > 28 && pos.lng > 85)
  {
    console.log(pos.lat , pos.lng);
    pos.lat = 26.7347;
    pos.lng = 83.3362;
  }
  io.emit('pos', pos);
  setTimeout(update, 3000);*/
}
update();
