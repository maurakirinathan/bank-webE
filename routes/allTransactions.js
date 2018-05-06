const  client = require("./cassandrainfo")
const client_elasticsearch =require("./elasticsearch")

/*
 * GET one trans.
 */
var JSONObj = new Object();
exports.list_one = function (req, res) {

    var id = req.params.id;
    console.log('trans: viewing one');

    client.execute("SELECT id,bank,promize_amount,promize_bank,from_account,to_account,type,from_zaddress,to_zaddress,timestamp from transactions WHERE id = " + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('trans: viewing one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('trans: viewing one succ:');
            res.render('transactionViewOne', {page_title: "Transactions Details", data: result.rows});
        }
    });

};

/*
 * GET trans listing .
 */
exports.list_transection = function (req, res) {

    console.log('processingTransaction: list');

     var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);


    client_elasticsearch.search({
        index: 'transactions',

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
        //  console.log(str);
        JSONObj["total"]= resp.hits.total;
        JSONObj["offset"]= 0;
        JSONObj["limit"]= 10;

        res.render('alltransaction', {page_title: " alltransaction", data: result ,data1:JSONObj})

    }, function (err) {
        console.trace(err.message);
    });
};

/*
 * GET one tra.
 */
exports.list_search = function (req, res) {



    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('trans: list_search');
    if (input.id) {
        client_elasticsearch.search({
            index: 'transactions',

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

            res.render('alltransaction_search', {page_title: "Transactions Details", data: result});

        }, function (err) {
            console.trace(err.message);
        });
    }
    else {
        var result = [];
        res.render('alltransaction_search', {page_title: "Transactions Details",});
    }
};


/*
 * GET cheques listing pagging next.
 */
var id_for_next=0;
exports.list_paging_next = function (req, res) {


    var id = req.params.id;
    id_for_next=id_for_next+10;
    console.log('processingTransaction: list');
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    client_elasticsearch.search({
        index: 'transactions',

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
        //  console.log(str);
        JSONObj["offset"]+= 10;
        JSONObj["limit"]= 10;


        res.render('alltransaction', {page_title: " alltransaction", data: result, data1:JSONObj})

    }, function (err) {
        console.trace(err.message);
    });
};

/*
 * GET cheques listing pagging previous.
 */
exports.list_paging_previous = function (req, res) {
    id_for_next=id_for_next-10;
    if(id_for_next<0)
    {
        id_for_next=0;
    }
    console.log('processingTransaction: list');

     var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);


    client_elasticsearch.search({
        index: 'transactions',

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
        //  console.log(str);
        JSONObj["offset"]-= 10;
        JSONObj["limit"]= 10;


        res.render('alltransaction', {page_title: " alltransaction", data: result, data1:JSONObj})

    }, function (err) {
        console.trace(err.message);
    });
};

