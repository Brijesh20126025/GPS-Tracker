/**
 * @module hostServer
 *
 */
var path = require('path'),
    fs = require('fs-extra'),
    http = require('http'),
    request = require('request'),
    dbio = require("./dbio");
var request = require('request');
//var socket = io();
console.log('Boottime ' + (new Date()).toString());
exports.setIO = function(i) {
    io = i;
};

exports.init = function(router, p) {
    p = p || '.';
    if (!router) {
        console.log("Router missing!");
        process.exit(1);
    }
    router.get('/pt/:apid',function(req,res){
	console.log(req.params.apid);
	console.log("sdasdkj");
        res.send(JSON.stringify(
	1234
	));
	});
    

    router.post('/post/:apid', function(req, res) {
        console.log(req.params.apid);
        var q, filter, data;
        switch (req.params.apid) {
            case 'updatePos':
                var p = req.query.pos.split(",");
             
                if (isNaN(p[0]) || isNaN(p[1])) {
                    res.status(200).send(JSON.stringify({
                        'status': false,
                        "msg": "Invalid LatLong value, expected Number,Number"
                    }));
                    return;
                }
                dbio.updateData(req.query.pos, function(e, dbres) {
                    if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    } else {
                        io.emit('pos', {
                            lat: parseFloat(p[0]),
                            lng: parseFloat(p[1])
			
                        });
                        res.status(200).send(JSON.stringify({
                            'status': true
                        }));
                    }
                });
                break;
            case 'lekha':
                var q = req.query;
                if (isNaN(q.lat) || isNaN(q.lon)) {
                    res.status(200).send(JSON.stringify({
                        'status': false,
                        "msg": "Invalid LatLong value, expected Number"
                    }));
                    return;
                }
                q.gCoords = {
                    lat: (q.latdir == "S" ? -1 : 1) * parseFloat(q.lat),
                    lng: (q.londir == "W" ? -1 : 1) * parseFloat(q.lon)
                };
                q.gCoords.deg = parseFloat(q.headindAngle);
                q.gCoords.imei = q.imei;
                dbio.updatePos(q, function(e, dbres) {
                    if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    } else {
                        io.emit('pos', q.gCoords);
                        res.status(200).send(JSON.stringify({
                            'status': true
                        }));
                    }
                });
                break;
        }
    });
  
   router.get('/test' , function(req,res){
    console.log("test.........");
    dbio.fun(req.query , function(e,dbres){
        if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    } else {
                       // socket.emit('pos',dbres);
                        res.status(200).json(dbres);}
    });

   });

    var url;
    router.get('/api/:apid', function(req, res) {
        var filter, q;
         
        switch (req.params.apid) {
            //case 'register':

           /***********************************************************************/
           //console.log("dhjddjdjddjd");
           /*res.setHeader('Connection', 'keep-alive');
           res.setHeader('Content-Type', 'text/event-stream');
           res.setHeader('Cache-Control', 'no-cache');
           res.writeHead(200);
           setTimeout(function() {

              res.write("this is an event");
              res.flushHeaders();
           }, 1000);

           setTimeout(function() {
                res.write("this is another event");
                res.end(res.query);
             }, 2000);*/

          /************************************************************************/

	      /* console.log("Req.query " + req.query); 
                dbio.insert(req.query, function(e, dbres) {
                    if (e) {
                        res.status(400).send(JSON.stringify/*
                            'status': e
                        }));
                    } else {
			           // socket.emit('pos',dbres);
                        res.status(200).json(dbres);
                    }
                });
                break;*/

            case 'updateGps':
                dbio.updateGps(req.query, function(e, dbres) {
                    if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    } else {
                        res.status(200).json(dbres);
                    }
                });
                break;
                 case 'getDevicePos':
                 console.log(req.query);
                dbio.getDevicePos(req.query, function(e, dbres) {

                    if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    } else {
                        res.status(200).json(dbres);
                    }
                });
                break;
                case 'getDevices':
                dbio.getDevices({}, function(e, dbres) {
                    if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    } else {
                        res.status(200).json(dbres);
                    }
                });
                break;
            case 'proxy':
                console.log(req.query);
                url = req.query.q;
                request(url, function(e, response, body) {
                    if (!e && response.statusCode == 200) {
                        res.status(200).send(body);
                    }
                    if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    }
                });
                break;
            default:
                request(url + "/" + req.params.apid, function(e, response, body) {
                    if (!e && response.statusCode == 200) {
                        res.setHeader('content-type', 'image/jpg');
                        res.status(200).send(body);
                    }
                    if (e) {
                        res.status(400).send(JSON.stringify({
                            'status': e
                        }));
                    }
                });
                break;
        }
    });
    return router;
};  
