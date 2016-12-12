var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'papriinstance.cn6vgrqyb2tb.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'abcd1234',
    database: 'PapriTestDB',
    debug: false
});
pool.getConnection(function(err, conn) {
    if (err) {
        
        return console.log(err);
       
    }
    console.log('db connected as id ' + conn.threadId);

    conn.on('error', function(err1) {
        return console.log(err1);
    });
    conn.release();
});
pool.query = function(a, b, c) {
    pool.getConnection(function(err, conn) {
        if (err) {
            return console.log(err);
        }
        console.log('connected as id ' + conn.threadId + typeof a);

        if (typeof a === "string") {
            conn.query(a, b, function(err, rows, f) {
                conn.release();
                
                    c(err, rows, f);
               
            });
        }
        if (typeof a === "object") {
            conn.query(a, function(err, rows, f) {
                conn.release();
                console.log(err, rows);
                //if (!err) {
                    b(err, rows, f);
                //}
            });
        }
        conn.on('error', function(err) {
            console.log({
                "code": 100,
                "status": "Error in conn database"
            });
            return;
        });
    });
1.};
exports = module.exports = pool;
