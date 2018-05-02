var cassandra = require('cassandra-driver');
var PropertiesReader = require('properties-reader');

var properties = PropertiesReader('PropertiesReader.js');
var host = properties.get('db.host');
var port = properties.get('db.port');
var keyspace = properties.get('db.keyspace');
var elasassandra_port = properties.get('db.elasassandra');


/*var host =  process.env.CASSANDRA_HOST;
var port = process.env.CASSANDRA_PORT;
var keyspace = process.env.CASSANDRA_KEYSPACE;
var elasassandra_port = process.env.ELASASSANDRA_PORT;*/


/*var elasticsearch = require('elasticsearch');
var client_elasticsearch = new elasticsearch.Client({
    host: host+':'+elasassandra_port,
});*/


/*
console.log('host: ' +host);
console.log('port: ' +port);*/

var client = new cassandra.Client({contactPoints: [host + ':' + port], keyspace: keyspace});
client.connect(function (err, result) {
    console.log('cchain: cassandra connected');
});

module.exports = client;

/*
 * GET home page.
 */

/*
exports.init_cassandra = function(req, res){

	client.connect()
		.then(function () {
			const query = "CREATE KEYSPACE IF NOT EXISTS people WITH replication =" +
			  "{'class': 'SimpleStrategy', 'replication_factor': '1' }";
			return client.execute(query);
		})
		.then(function () {
			const query = "CREATE TABLE IF NOT EXISTS people.subscribers" +
				" (id uuid, name text, address text, email text, phone text, PRIMARY KEY (id))";
			return client.execute(query);
		})
		.then(function () {
			return client.metadata.getTable('people', 'subscribers');
		})
		.then(function (table) {
			console.log('Table information');
			console.log('- Name: %s', table.name);
			console.log('- Columns:', table.columns);
			console.log('- Partition keys:', table.partitionKeys);
			console.log('- Clustering keys:', table.clusteringKeys);
		})
		.then(function () {
			console.log('Read cluster info');
			var str = '{"hosts": [';
			var i = 0;
			client.hosts.forEach(function (host) {
				i++;
	  			str += '{"address" : "' + host.address + '", "version" : "' + host.cassandraVersion + '", "rack" : "' + host.rack + '", "datacenter" : "' + host.datacenter + '"}';
	  			console.log("hosts.length: " + client.hosts.length);
				if (i < client.hosts.length)
					str += ',';

			});
			str += ']}';
			console.log('JSON string: ' + str);
			var jsonHosts = JSON.parse(str);
			res.render('cassandra', {page_title:"Cassandra Details", data: jsonHosts.hosts});
			console.log('initCassandra: success');
		})
		.catch(function (err) {
			console.error('There was an error', err);
			res.status(404).send({msg: err});
			return client.shutdown();
		});

};*/
