
var PropertiesReader = require('properties-reader');
var elasticsearch = require('elasticsearch');

var properties = PropertiesReader('PropertiesReader.js');
var host = properties.get('db.host');
var elasassandra_port = properties.get('db.elasassandra');

/*var host =  process.env.CASSANDRA_HOST;
var port = process.env.CASSANDRA_PORT;
var keyspace = process.env.CASSANDRA_KEYSPACE;
var elasassandra_port = process.env.ELASASSANDRA_PORT;*/


var client_elasticsearch = new elasticsearch.Client({
    host: host+':'+elasassandra_port,
});

module.exports = client_elasticsearch;