
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { page_title: 'Hello Container World' });

};


/*
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['localhost:9042'], keyspace: 'cchain'});
client.connect(function (err, result) {
    console.log('cchain: cassandra connected');
});
*/
