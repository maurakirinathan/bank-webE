# bank-webE

this is `elassandra` integration of webz

# Configure elasassandra

## create keyspace

```
CREATE KEYSPACE cchain WITH replication = 
{'class':'NetworkTopologyStrategy', 'DC1':'1'};
```

## create index

```
curl -XPUT "http://172.17.0.2:9200/TABLENAME" -d '{
  "settings":{
    "keyspace": "cchain"
  },
  "mappings": {
    "TABLENAME" : {
      "discover" : ".*"
    }
  }
}'
```

