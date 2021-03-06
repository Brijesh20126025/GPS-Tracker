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
    //router = express.Router(),
    cookieParser = require('cookie-parser'),
    compress = require('compression'),
    dbio = require("./dbio"),
    db = require("./db"),
    app = express(),
    url = require('url');
    
var options = {};
app.set('port', process.env.PORT || 8765);
//app.use(auth);
//app.use(function(req, res, next) {

  var keepAliveAgent = new http.Agent({ keepAlive: true });

   /* options.agent = keepAliveAgent;
    http.request(options, onResponseCallback);  
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/

/***************************/
app.use(compress());
app.use(bodyParser.json({
    limit: '50mb'
}));
/*************************/
app.use(bodyParser.urlencoded({
    //limit: '50mb',
    extended: true
}));

app.use(cookieParser());
//var hs = require('./routes');
app.use(express.static(path.join(__dirname, '../')));

//app.use("/uploads", express.static(path.join(__dirname, '../../uploads')));
//app.use(hs.init(router, './server/'));
/*app.use(function(req, res) {
	//console.log("Brijesh");
    res.status(404).send("error");
}); */

KeepAliveAgent = require('keep-alive-agent');

/*var getOptions = {
    hostname: 'localhost',
    port: 8765,
    path: '/api/register',
    method: 'POST',
    agent: new KeepAliveAgent()
};*/

var server = http.createServer(app).listen(app.get('port'), function() {
    console.info('Express server listening on port ' + app.get('port'));
});
io = require('socket.io')(server);
//hs.setIO(io);
//io.set('transports', ['websocket']);
var total_user= 1;

/*http.get(getOptions, function(res)                                                                                                                                                              
{
     res.setEncoding('utf8');
     //console.log(res.query.imei);
     res.on('data', function (body) {
        console.log(body);
      });
});
*/

// Logic Starts..............

/***************************************************************************************************************************************/
var flag = 0;

app.post('/api/register' , function(req,res){
   //console.log("Inside /");
   //console.log(req.query.imei);//.toString());
   var imei = req.body.imei;
   console.log("server code mei h");
   console.log(imei);
  // alert(req.query);
    if(req.query){
    insert(req,res);
  }
  //console.log("after the insert....");

});

/***************************************************************************************************************************************/

function insert(req,res){

dbio.insert(req.body, function(e, dbres) {
                    if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    } else {
                 // socket.emit('pos',dbres);
                        /*var obj = {
                          ACK : "ACK"
                        };*/
                        flag = 1;
                       // res.status(200).json(obj);
                       res.status(200).send('ACK');
                    }
                });
  }

/**************************************************************************************************************************************/

app.get('/api/getDevicePos' , function(req,res){

  //console.log("brijesh");

dbio.getDevicePos(req.query, function(e, dbres) {

                    if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    } else {
                        res.status(200).json(dbres);
                    }

});
});

/****************************************************************************************************************************************/

app.get('/api/getTable', function(req,res){
  
  db.query('SHOW TABLES LIKE ?' , req.query.imei , function(err,result2){
    if(result2.length!=0){
      console.log("ressult2 is " ,result2.length);
      get_lat_lng(req.query.imei,req,res);
    }
    else{
      createTable(req.query.imei);
    }

  });
});
  
  function get_lat_lng(imei,req,res){

  console.log(imei);   
  db.query("SELECT id , ST_Y(latlng) as lat, ST_X(latlng) as lng FROM ?? ",imei , function(err,result){
      if(err){

        console.log("Eroor in getting /api/getTable req..");
        throw err;
      }
      else{
        //console.log(res);
        res.status(200).json(result);
      }

  });
}

function createTable(tb_name){

      db.query('CREATE TABLE ?? (`id` int(11) PRIMARY KEY AUTO_INCREMENT, `latlng` POINT)', [tb_name], function (error, results) {
                if(error){
                    console.log("Error in newly Created Tabel..");
                    throw error;
                }

               else
                {
                    console.log("newly table Created Successfully..");
                }
           
              });
               
   }

//res.status(200).send("Hello");   

/****************************************************************************************************************************************/

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

 /*****************************************************************************************************************************************/

io.on('connection', function(socket) {
     //url = url.parse(socket);
     //console.log(socket.request);
     console.log("Path is " + socket.handshake.url);
     console.log("Id of connected User " + total_user++ +"--"+socket.id); 
     //getMap(socket);  // Error getMap() is not defined...
     io.sockets.emit('getDeviceLocation', "geeting all device info...");

     updategps();


    /* socket.on('updategps', function(msg,callback){

         if(flag == 1){
            console.log("flag " + flag);
            socket.emit('getDeviceLocation', "geeting all device info...");
            flag = 0;
          }
           
           console.log("client Id "+ socket.id +"-->  ");
           console.log(msg);
           callback("Ack from server msg receive...");
     });  */
     //callback("ack  from server " + msg);
  
    /*socket.on('msg' , function(msg , call){
      console.log("msg is " + msg);
      var ack = "ack from server";
      call(ack);
    });*/

    socket.on('disconnect' ,function(){
      console.log('user ' + --total_user + ' disconnected  id is', socket.id);
    });
   // new user(socket);
});

function updategps(){
  //console.log("BRIJESHPPP");
  if(flag==1){
   io.sockets.emit('updateMarker', "geeting all device info...");
   //console.log("hiii........");
   flag = 0;
  }
  setTimeout(function(){
    updategps();
  }, 15000);
}

process.on('uncaughtException', function(err) {
  //  console.log("Brijehs error");
    console.error(err.stack);
});

/***************************************************************************************************************************************/
 
/*function user (soc) {
    var id = soc.id;
    soc.on('disconnect', function(){
    console.log('user ' + --total_user + 'disconnected  id is', id);
  });*/

//}

//var pos = {lat:26.7347, lng: 83.3362,imei:5};
/*function update() 
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
//}
//update();*/
//} */

/***********************************************************************************************************************************************/