const client = require("./cassandrainfo")
const client_elasticsearch = require("./elasticsearch")
/*
 * GET blocks listing.
 */

var JSONObj = new Object();
var JSONObj_search = new Object();
exports.list = function (req, res) {

    console.log('allblocks: list');

    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    client_elasticsearch.search({
        index: 'blocks',

        body: {
            _source: ["id", "timestamp", "transactions", "miner"],
            query: {

                bool: {
                    must: [
                        {
                            term: {miner: "sampath"}
                        }
                    ]
                }
            },
            sort: [
                {timestamp: "desc"}
            ],
            from: 0, size: 10
        }
    }).then(function (resp) {
        var result = [];
        for (var i = 0; i < resp.hits.hits.length; i++) {
            result.push(resp.hits.hits[i]._source);

        }
        console.log(resp.hits);

        JSONObj["total"] = resp.hits.total;
        JSONObj["offset"] = 0;
        JSONObj["limit"] = 10;

        res.render('allblocks', {page_title: "All Blocks", data: result, data1: JSONObj})

    }, function (err) {
        console.trace(err.message);
    });
};


/*
exports.list_alltransaction_blocks = function (req, res) {

    console.log('alltransaction_blocks: list');
    client.execute('SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM transactions LIMIT 10', [], function (err, result) {
        if (err) {
            console.log('alltransaction_blocks: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('alltransaction_blocks: list succ:', result.rows);
            res.send('alltransaction_blocks', {page_title: "All Blocks", data: result.rows})
        }
    });

};
*/


/*
 * GET one block.
 */
/*
exports.list_one = function (req, res) {

    var id = req.params.id;
    console.log('block: viewing one');

    client.execute("SELECT id,miner,hash,merkle_root,timestamp,transactions from blocks WHERE id = " + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('block: viewing one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('block: viewing one succ:');
            res.render('blockViewOne', {page_title: "Block Details", data: result.rows});
        }
    });

};
*/


/*
 * GET one block.
 */
exports.list_one = function (req, res) {

    var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    console.log(input);
    console.log('blocks: list_search');

        client_elasticsearch.search({
            index: 'blocks',

            body: {

                query: {
                    bool: {
                        must: [
                            {
                                term: {id: id}
                            }
                        ]
                    }

                }
            }
        }).then(function (resp) {
            var result = [];
            for (var i = 0; i < resp.hits.hits.length; i++) {
                result.push(resp.hits.hits[i]._source);
            }
            console.log(resp.hits.hits);


            res.render('blockViewOne', {page_title: "Block Details", data: result});

        }, function (err) {
            console.trace(err.message);
        });
  };


/*
 * GET one block.
 */
exports.list_search = function (req, res) {

    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    console.log(input);
    console.log('blocks: list_search');
    if (input.id) {
        client_elasticsearch.search({
            index: 'blocks',

            body: {
                _source: ["id", "timestamp", "transactions", "miner"],
                query: {
                    bool: {
                        must: [
                            {

                                wildcard: {
                                    id: input.id + "*"

                                }
                            }

                        ]
                    }

                },
                sort: [
                    {timestamp: "desc"}
                ],
                from: 0, size: 10
            }
        }).then(function (resp) {
            var result = [];
            for (var i = 0; i < resp.hits.hits.length; i++) {
                result.push(resp.hits.hits[i]._source);
            }
            console.log(resp.hits.hits);

            JSONObj_search["total"] = resp.hits.total;
            JSONObj_search["offset"] = 0;
            JSONObj_search["limit"] = 10;
            JSONObj_search["search_field"] = input.id;

            res.render('allblocks_search', {page_title: "Block Details", data: result, data2: JSONObj_search});

        }, function (err) {
            console.trace(err.message);
        });
    }
    else {
        var result = [];
        res.render('allblocks_search', {page_title: "Block Details",});
    }
};


/*
 * GET cheques listing pagging next. run
 */
var id_for_next = 0;
exports.list_paging_next = function (req, res) {


    id_for_next = id_for_next + 10;
    console.log('allblocks_next: list');
    var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('blocks: list_next');

    client_elasticsearch.search({
        index: 'blocks',

        body: {
            _source: ["id", "timestamp", "transactions", "miner"],
            query: {

                bool: {
                    must: [
                        {
                            term: {miner: "sampath"}
                        }
                    ]
                }
            },
            sort: [
                {timestamp: "desc"}
            ],
            from: id, size: 10
        }
    }).then(function (resp) {
        var result = [];
        for (var i = 0; i < resp.hits.hits.length; i++) {
            result.push(resp.hits.hits[i]._source);
        }
        console.log(resp.hits);
        //  console.log(str);
        JSONObj["offset"] += 10;
        JSONObj["limit"] = 10;

        var test1 = 100

        res.render('allblocks', {page_title: "All Blocks", data: result, data1: JSONObj})

    }, function (err) {
        console.trace(err.message);
    });
};

/*
 * GET cheques listing pagging previous.
 */
exports.list_paging_previous = function (req, res) {


    id_for_next = id_for_next - 10;
    if (id_for_next < 0) {
        id_for_next = 0;
    }

    console.log('allblocks_previous: list');
    var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('promizes: list_privoes');

    client_elasticsearch.search({
        index: 'blocks',

        body: {
            _source: ["id", "timestamp", "transactions", "miner"],
            query: {

                bool: {
                    must: [
                        {
                            term: {miner: "sampath"}
                        }
                    ]
                }
            },
            sort: [
                {timestamp: "desc"}
            ],
            from: id, size: 10
        }
    }).then(function (resp) {
        var result = [];
        for (var i = 0; i < resp.hits.hits.length; i++) {
            result.push(resp.hits.hits[i]._source);
        }
        console.log(resp.hits);
        //  console.log(str);
        JSONObj["offset"] -= 10;
        JSONObj["limit"] = 10;

        res.render('allblocks', {page_title: "All Blocks", data: result, data1: JSONObj})

    }, function (err) {
        console.trace(err.message);
    });
};


/*
 * SEARCH NEXT one block.
 */
exports.list_search_next = function (req, res) {

    var id = req.params.id;


    console.log('blocks: list_search_next');

    client_elasticsearch.search({
        index: 'blocks',

        body: {
            _source: ["id", "timestamp", "transactions", "miner"],
            query: {
                bool: {
                    must: [
                        {

                            wildcard: {
                                id: JSONObj_search.search_field + "*"

                            }
                        }

                    ]
                }

            },
            sort: [
                {timestamp: "desc"}
            ],
            from: id, size: 10
        }
    }).then(function (resp) {
        var result = [];
        for (var i = 0; i < resp.hits.hits.length; i++) {
            result.push(resp.hits.hits[i]._source);
        }
        console.log(resp.hits.hits);

        JSONObj_search["offset"] += 10;
        JSONObj_search["limit"] = 10;

        res.render('allblocks_search', {page_title: "Block Details", data: result, data2: JSONObj_search});

    }, function (err) {
        console.trace(err.message);
    });

};


/*
 * SEARCH previous one block.
 */
exports.list_search_previous = function (req, res) {

    var id = req.params.id;

    console.log('blocks: list_search');

    client_elasticsearch.search({
        index: 'blocks',

        body: {
            _source: ["id", "timestamp", "transactions", "miner"],
            query: {
                bool: {
                    must: [
                        {

                            wildcard: {
                                id: JSONObj_search.search_field + "*"

                            }
                        }

                    ]
                }

            },
            sort: [
                {timestamp: "desc"}
            ],
            from: id, size: 10
        }
    }).then(function (resp) {
        var result = [];
        for (var i = 0; i < resp.hits.hits.length; i++) {
            result.push(resp.hits.hits[i]._source);
        }
        console.log(resp.hits.hits);

        JSONObj_search["offset"] -= 10;
        JSONObj_search["limit"] = 10;

        res.render('allblocks_search', {page_title: "Block Details", data: result, data2: JSONObj_search});

    }, function (err) {
        console.trace(err.message);
    });

};