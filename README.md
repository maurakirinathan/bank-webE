# bank-webE

this is `elassandra` integration of webz

# Configure elasassandra

## create keyspace

```
CREATE KEYSPACE cchain WITH replication = 
{'class':'NetworkTopologyStrategy', 'DC1':'1'};
```

## create index blocks

```
curl -XPUT "http://172.17.0.2:9200/blocks" -d '{
  "settings":{
    "keyspace": "cchain"
  },
  "mappings": {
    "blocks" : {
      "discover" : ".*"
    }
  }
}'
```

## create index transactions

```
curl -XPUT "http://172.17.0.2:9200/transactions" -d '{
  "settings":{
    "keyspace": "cchain"
  },
  "mappings": {
    "transactions" : {
      "discover" : ".*"
    }
  }
}'
```

## create index processing transaction

```
curl -XPUT "http://172.17.0.2:9200/trans" -d '{
  "settings":{
    "keyspace": "cchain"
  },
  "mappings": {
    "trans" : {
      "discover" : ".*"
    }
  }
}'
```

## create index promizes

```
curl -XPUT "http://172.17.0.2:9200/promizes" -d '{
  "settings":{
    "keyspace": "cchain"
  },
  "mappings": {
    "promizes" : {
      "discover" : ".*"
    }
  }
}'
```


## create index users

```
curl -XPUT "http://172.17.0.2:9200/users" -d '{
  "settings":{
    "keyspace": "cchain"
  },
  "mappings": {
    "users" : {
      "discover" : ".*"
    }
  }
}'
``````

