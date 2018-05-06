# bank-webE

#Configure elasassandra

# create keyspace
CREATE KEYSPACE cchain 
WITH replication = {'class':'NetworkTopologyStrategy', 'DC1':'1'};

# create index

curl -XPUT "http://172.17.0.2:9200/<tablename>" -d '{
  "settings":{
    "keyspace": "cchain"
  },
  "mappings": {
    "<tablename>" : {
      "discover" : ".*"
    }
  }
}'

