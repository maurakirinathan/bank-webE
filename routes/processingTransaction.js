const  client = require("./cassandrainfo")
const client_elasticsearch =require("./elasticsearch")
/*
 * GET pending trans listing.
 */
exports.list = function (req, res) {

    console.log('processingTransaction: list');

    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);


    client_elasticsearch.search({
        index: 'trans',

        body: {
            query: {

                bool: {
                    must: [
                        {
                            term: {bank: "sampath"}
                        }
                    ]
                }
            },
            sort: [
                {bank: "desc"}
            ],
            from: 0, size: 10
        }
    }).then(function (resp) {
        var result = [];
        for (var i = 0; i < resp.hits.hits.length; i++) {
            result.push(resp.hits.hits[i]._source);
        }
        console.log(resp.hits.hits);
        //  console.log(str);

        res.render('processingTransaction', {page_title: " processingTransaction", data: result})

    }, function (err) {
        console.trace(err.message);
    });

    /*client.execute('SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM trans LIMIT 10', [], function (err, result) {
        if (err) {
            console.log('pending trans: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('processing Transaction transaction: list succ:', result.rows);
            res.render('processingTransaction', {page_title: "Processing Transactions", data: result.rows})
        }
    });*/

};

/*
 * GET one pending trans.
 */
exports.list_one = function (req, res) {

    var id = req.params.id;
    console.log('trans: viewing one');

    client.execute("SELECT id,bank,promize_amount,promize_bank,from_account,to_account,type,from_zaddress,to_zaddress,timestamp from trans WHERE id = " + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('trans: viewing one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('processing Transaction View One: viewing one succ:');
            res.render('processingTransactionViewOne', {page_title: "Processing Transactions Details", data: result.rows});
        }
    });

};

/*
 * GET one block.
 */
exports.list_search = function (req, res) {


    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('trans: list_search');
    if (input.id) {
        client_elasticsearch.search({
            index: 'trans',

            body: {
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

                }
            }
        }).then(function (resp) {
            var result = [];
            for (var i = 0; i < resp.hits.hits.length; i++) {
                result.push(resp.hits.hits[i]._source);
            }
            console.log(resp.hits.hits);

            res.render('processingTransaction', {page_title: "Processing Transactions Details", data: result});

        }, function (err) {
            console.trace(err.message);
        });
    }
    else {
        var result = [];
        res.render('processingTransaction', {page_title: "Processing Transactions Details",});
    }



    // var id = req.params.id;
  /*  var input = JSON.parse(JSON.stringify(req.body));
    var validate = require('uuid-validate');

    console.log(input);
    console.log('pending trans: list_search');
    if (validate(input.id)) {
        client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp from trans WHERE id = " + input.id + " ALLOW FILTERING", [], function (err, result) {
            if (err) {
                console.log('pending trans: search one err:', err);
                res.status(404).send({msg: err});
                res.render('trans', {page_title: "trans Details",});
                //  allblocks();
            } else {
                console.log('processing Transaction: search one succ:');
                res.render('processingTransaction', {page_title: "Processing Transactions Details", data: result.rows});
            }
        });
    }
    else
    {
        var result=[];
        res.render('processing Transaction', {page_title: "Transaction Details", data:result});

    }*/
};

/*
 * GET cheques listing pagging next.
 */
var test1=0;
exports.list_paging_next = function (req, res) {
    test1=test1+10;
    console.log('processingTransaction: list');
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    client_elasticsearch.search({
        index: 'trans',

        body: {
            query: {

                bool: {
                    must: [
                        {
                            term: {bank: "sampath"}
                        }
                    ]
                }
            },
            sort: [
                {bank: "desc"}
            ],
            from: test1, size: 10
        }
    }).then(function (resp) {
        var result = [];
        for (var i = 0; i < resp.hits.hits.length; i++) {
            result.push(resp.hits.hits[i]._source);
        }
        console.log(resp.hits.hits);
        //  console.log(str);

        res.render('processingTransaction', {page_title: " processingTransaction", data: result})

    }, function (err) {
        console.trace(err.message);
    });
/*
    console.log('id:  ' +id );
    client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM trans WHERE id < "+ id + "LIMIT 10 ALLOW FILTERING", [], function (err, result) {
        if (err) {""
            console.log('pendingTransaction: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('processing Transaction: list succ:', result.rows);
            res.status(200).send(result.rows);
        //    res.render('processingTransaction', {page_title: "Processing Transactions", data: result.rows})

        }
    });*/

};

/*
 * GET cheques listing pagging previous.
 */
exports.list_paging_previous = function (req, res) {


    test1=test1-10;
    if(test1<0)
    {
        test1=0;
    }
    console.log('processingTransaction: list');

    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);


    client_elasticsearch.search({
        index: 'trans',

        body: {
            query: {

                bool: {
                    must: [
                        {
                            term: {bank: "sampath"}
                        }
                    ]
                }
            },
            sort: [
                {bank: "desc"}
            ],
            from: test1, size: 10
        }
    }).then(function (resp) {
        var result = [];
        for (var i = 0; i < resp.hits.hits.length; i++) {
            result.push(resp.hits.hits[i]._source);
        }
        console.log(resp.hits.hits);
        //  console.log(str);

        res.render('processingTransaction', {page_title: " processingTransaction", data: result})

    }, function (err) {
        console.trace(err.message);
    });

/*    console.log('pendingTransaction: list');
    var id = req.params.id;
    console.log('id:', id);
    client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM trans WHERE expr(trans_lucene_index," +"\'{ sort: [ {type: \"simple\", field: \"id\", reverse: true} ] }"+"\') AND bank='sampath' AND id <"+ id + " LIMIT 10 ALLOW FILTERING", [], function (err, result) {
        if (err) {""
            console.log('pendingTransaction: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('processing Transaction: list succ:', result.rows);
            res.render('processingTransaction', {page_title: "Processing Transactions", data: result.rows})
        }
    });*/

};
