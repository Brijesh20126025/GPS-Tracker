var db = require("./db");
//console.log(pHash.verify('password123', hashedP));

exports = module.exports = {

/***************************************************************************************************************************************/

    updateGps: function(o, cb) {
        console.log(o.latlng);
        db.query("UPDATE `gps` SET `latlng`= GeomFromText('POINT(" + o.latlng.split(",").join(" ") + ")') WHERE imei = ?", [o.imei], function(err, result) {
            console.log(err);
            cb(err, result);
        });
    },

/************************************************************************************************************************************/
    
    getAround: function(o, cb) {
        function getDist(error, results, fields) {
            var l = results[0];
            console.log(error, l && l.loc);
            if (l.loc) {
                db.query({
                    //sql: "SELECT name, username FROM users WHERE ST_Distance(loc, GeomFromText('POINT(" + l.loc.x + " " + l.loc.y + ")')) < ?;",
                    sql: "SELECT username, name ,((((acos(sin((" + l.loc.y + "*pi()/180)) * sin((ST_Y(loc)*pi()/180))+cos((" + l.loc.y + "*pi()/180)) * cos((ST_Y(loc)*pi()/180)) * cos(((" + l.loc.x + "- ST_X(loc))*pi()/180))))*180/pi())*60*1.1515*1.609344)) as `distance` FROM `users` HAVING distance <= ? AND `username` != ? ORDER BY `distance`",
                    timeout: 40000, // 40s
                    values: [o.radius, o.username]
                }, function(error, results, fields) {
                    cb(error, results);
                });
            } else {
                cb("User location is not set");
            }
        }
        if (o.latlng) {
            var lt = o.latlng.split(",")[0],
                ln = o.latlng.split(",")[1];
            getDist(null, [{
                loc: {
                    x: ln,
                    y: lt
                }
            }])
        } else {
            db.query({
                sql: "SELECT loc FROM users WHERE username = ?;",
                timeout: 40000, // 40s
                values: [o.username]
            }, getDist);
        }
    },

 /**********************************************************************************************************************************/

    insert: function(o, cb) {
	console.log("O "+o);
	console.log(o.lat + " "+ o.lng +"user " + o.user);		
    var opt = 
    { 
	   header1: o.header1,
	   sDate  : o.sDate,
	   sTime  : o.sTime,
	   latdir : o.latdir,
	   londir : o.londir,
	   speed  : o.speed,
       user   : o.user,
       phone  : o.phone,
       cab    : o.cab,
       headingAngle: o.headingAngle,
       panicstatus: o.panicstatus,
       packetstatus: o.packetstatus,
	   SV        : o.SV,
	   ac_status : o.ac_status,
	   ack_sts   : o.ack_sts,
	   inp_sts   : o.inp_sts,
	   ing_sts   : o.ing_sts  	    
    };

        db.query('select *from `gps` where imei= ?',o.imei,function(err,result){
                  if(result.length!=0){
                    update();
                  }else{
                    register();
                 }
        });

        function register(){
            //f=1;
        console.log("inside the insert function new ly added");
        db.query('INSERT INTO `gps` SET latlng = POINT(?,?) , ?, imei= ?',[o.lat,o.lng,opt,o.imei],function(err, result) {
            
           


           // console.log(err);
            cb(err, result);
        });
   }
        function update(){
          //  f=0;
            console.log("inside the updateGps function kkkkkk ");
            db.query('UPDATE `gps` SET  latlng= POINT(?,?),? WHERE imei= ?', [o.lat,o.lng,opt,o.imei], function(err,result){
                //console.log("result is" ,result);
                if(err)
                console.log("error in updating the gps table " + err);
                cb(err,result);
            });
        }

        console.log("lat= " + o.lat + "lng = " + o.lng);

},



    fun: function(o, cb) {
                console.log("abcdtest");
        db.query('SELECT * FROM `test`',function(err, result) {
            cb(err, result);
        });
    },

/*********************************************************************************************************************************/

    insertMsg: function(o, cb) {

        db.query('INSERT INTO `messages` SET ?', o, function(err, result) {
            cb(err, result);
        });
    },

/********************************************************************************************************************************/ 

     getDevicePos: function(o, cb) {
        console.log("O.Imei " + o.imei);
        if (o.imei) {
            db.query({
                sql: "SELECT ST_Y(latlng) as lat, ST_X(latlng) as lng  FROM PapriTestDB.gps WHERE `imei` = ?;",
                timeout: 40000, // 40s
                values: [o.imei]
            }, function(error, results, fields) {
                //console.log(error, o.imei, results);
                cb(error, results);
            });
        } else {
            db.query({
                sql: "SELECT imei, ST_Y(latlng) as lat, ST_X(latlng) as lng , cab ,user,sDate FROM PapriTestDB.gps;",
                timeout: 40000, // 40s
                values: [o.imei]
            }, function(error, results, fields) {
                //console.log("Brijesh   " + fields);
                
                cb(error, results);
            });
        }
    },

/*******************************************************************************************************************************/

    getDevices: function(o, cb) {
        db.query({
            sql: "SELECT `imei`  FROM PapriTestDB.gps;",
            timeout: 40000, // 40s
            values: []
        }, function(error, results, fields) {
            cb(error, results);
        });
    },

/******************************************************************************************************************************/

    deletePendingMsg: function(o, cb) {
        db.query({
            sql: "DELETE FROM PapriTestDB.messages WHERE `to` = ?;",
            timeout: 40000, // 40s
            values: [o.username]
        }, function(error, results, fields) {
            cb(error, results);
        });
    },

/******************************************************************************************************************************/

    verifyUser: function(o, cb) {
        db.query({
            sql: 'SELECT * FROM `users` WHERE `username` = ?',
            timeout: 40000,
            values: [o.username]
        }, function(error, results, fields) {
            console.log(error, results);
            if (!error && results[0] && pHash.verify(o.password, results[0].password)) {
                cb(null, true);
            } else if (error) {
                cb(error);
            } else {
                cb("Unauthorized");
            }
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });
    }

/********************************************************************************************************************************/

};
