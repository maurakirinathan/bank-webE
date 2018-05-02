
/**
 * Module dependencies.
 */
var moment = require('moment');
var express = require('express');
var routes = require('./routes');
var session = require('express-session');
var http = require('http');
var path = require('path');

var cassandra = require('cassandra-driver');
var PropertiesReader = require('properties-reader');


//load cassandra route
var cassandrainfo = require('./routes/cassandrainfo');

//load blocks route
var allblocks = require('./routes/allblocks');

//load pending transaction
var processingTransaction = require('./routes/processingTransaction');

//load cheques transaction
var allpromizes = require('./routes/promizes');

//load all trans
var allTransactions = require('./routes/allTransactions');

//load users
var users = require('./routes/users');

var app = express();

var index = require('./routes/index');


app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

var properties = PropertiesReader('PropertiesReader.js');
 var host =  properties.get('db.host');
 var port = properties.get('db.port');
 var keyspace = properties.get('db.keyspace');
var elasassandra_port = properties.get('db.elasassandra');


/*
var host =  process.env.CASSANDRA_HOST;
var port = process.env.CASSANDRA_PORT;
var keyspace = process.env.CASSANDRA_KEYSPACE;
var elasassandra_port = process.env.ELASASSANDRA_PORT;
*/
/*var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: host+':'+elasassandra_port,
});*/


var client = new cassandra.Client({contactPoints: [host+':'+port], keyspace: keyspace});
client.connect(function (err, result) {
    console.log('cchain: cassandra connected');
});

//var cassandra = require('cassandra-driver');

//const client = new cassandra.Client({contactPoints: ['localhost:9042'], keyspace: 'cchain' });

// all environments
app.set('port', process.env.PORT || 8082);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'public')));


// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    if (req.session && req.session.user === "admin" && req.session.admin) {
        //
        console.log("there : 200");
        return next();
    } else {
       console.log("there is a prob : 401");
       // return  res.status(401).send();
        return res.redirect("/");

    }

};

/*app.get('/', routes.index);*/
//---------------------------------------
app.get('/',index.index);
app.get('/allblocks',auth,allblocks.list);
app.get('/allblocks/:id',auth,allblocks.list_one);
app.post('/allblocks_search',auth,allblocks.list_search);
app.post('/alltransaction_blocks',auth,allblocks.list_alltransaction_blocks);

app.get('/allblocks_previous/:id',auth,allblocks.list_paging_previous);
app.get('/allblocks_next/:id',auth,allblocks.list_paging_next);


app.get('/allpromizes',auth,allpromizes.list);
app.get('/alltransaction_promize/:id',auth,allpromizes.transactions_for_promize);
app.get('/allpromizes_previous/:id',allpromizes.list_paging_previous);
app.get('/allpromizes_next/:id',auth,allpromizes.list_paging_next);
app.get('/promizesview/:id',auth,allpromizes.list_one);
app.post('/allpromizes_search',auth,allpromizes.list_search);


app.get('/processingTransaction',auth,processingTransaction.list);
app.get('/processingTransaction/:id',auth,processingTransaction.list_one);
app.post('/processingTransaction_search',auth,processingTransaction.list_search);
app.get('/processingTransaction_previous/:id',auth,processingTransaction.list_paging_previous);
app.get('/processingTransaction_next/:id',auth,processingTransaction.list_paging_next);


//app.get('/alltrans',allTransactions.list_trans);
app.get('/alltransaction',auth,allTransactions.list_transection);
app.post('/transection_search',auth,allTransactions.list_search);
app.get('/transectionview/:id',auth,allTransactions.list_one);
app.get('/allTransaction_previous/:id',auth,allTransactions.list_paging_previous);
app.get('/allTransaction_next/:id',auth,allTransactions.list_paging_next);


app.get('/users',auth,users.list);
app.get('/users_one/:id',auth,users.list_one);
app.post('/users_search',auth,users.list_search);
app.get('/users_next/:id',auth,users.list_paging_next);
app.get('/user_inactive/:id',auth,users.user_inactive);
app.get('/user_active/:id',auth,users.user_active);

// Login endpoint
app.get('/login', function (req, res) {
    if (!req.query.username || !req.query.password) {
        res.send('login failed');

    } else if(req.query.username === "admin" && req.query.password === "admin") {
       req.session.user = "admin";
       req.session.admin = true;
       res.redirect("/allblocks");


    }
});

// Logout endpoint
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect("/");
});


//app.get('/cassandrainfo', cassandrainfo.init_cassandra);

app.get('/', routes.index);


//----------------------------

//app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
