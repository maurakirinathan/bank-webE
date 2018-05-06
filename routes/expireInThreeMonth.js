const  client = require("./cassandrainfo")
const client_elasticsearch =require("./elasticsearch")

/*
 * GET one trans.
 */
var JSONObj = new Object();
exports.list_one = function (req, res) {

    var id = req.params.id;
    console.log('expireInThreeMonth: viewing one');

    client.execute("SELECT id,bank,promize_amount,promize_bank,from_account,to_account,type,from_zaddress,to_zaddress,timestamp from transactions WHERE id = " + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('trans: viewing one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('trans: viewing one succ:');
            res.render('expireInThreeMonthsViewOne', {page_title: "Transactions Details", data: result.rows});
        }
    });

};

/*
 * GET trans listing .
 */
exports.list_transection = function (req, res) {

    console.log('expireInThreeMonth: list');

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

        res.render('expireInThreeMonth', {page_title: " expireInThreeMonth", data: result, data1:JSONObj})

    }, function (err) {
        console.trace(err.message);
    });

/*
    //var oldDateObj = new Date();
    var d = new Date();
    var n = d.getTime();
    var newDateObj = n - 7.884e+9;

    //var newDateObj = moment(oldDateObj).add(30, 'm').toDate();
    console.log('expireInThreeMonth: list');
    console.log(newDateObj);
    //client.execute('SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM transactions LIMIT 10', [], function (err, result) {
    client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM trans WHERE timestamp < " +newDateObj +" ALLOw FILTERING", [], function (err, result) {
        if (err) {
            console.log('alltransaction: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('alltransaction: list succ:', result.rows);
            res.render('expireInThreeMonth', {page_title: "All Transactions", data: result.rows})
        }
    });
*/

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

            res.render('expireInThreeMonth_search', {page_title: "expireInThreeMonth Transactions Details", data: result});

        }, function (err) {
            console.trace(err.message);
        });
    }
    else {
        var result = [];
        res.render('expireInThreeMonth_search', {page_title: "expireInThreeMonth Transactions Details",});
    }

/*
    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));
    var validate = require('uuid-validate');

    console.log(input);
    console.log('expireInThreeMonth: list_search');
    if (validate(input.id)) {
        client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp from transactions WHERE id = " + input.id + " ALLOW FILTERING", [], function (err, result) {
            if (err) {
                console.log(' transaction: search one err:', err);
                res.status(404).send({msg: err});
                res.render('alltransaction', {page_title: "Transaction Details",});
                //  allblocks();
            } else {
                console.log(' transaction: search one succ:');
                res.render('expireInThreeMonth', {page_title: "Transaction Details", data: result.rows});
            }
        });
    }
    else
    {
        var result=[];
        res.render('expireInThreeMonth', {page_title: "Transaction Details", data:result});

    }*/
};


/*
 * GET cheques listing pagging next.
 */
var id_for_next=0;
exports.list_paging_next = function (req, res) {

    var id = req.params.id;
    id_for_next=id_for_next+10;
    console.log('expireInThreeMonth: list');
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
                {timestamp: "desc"}
            ],
            from: id_for_next, size: 10
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

        res.render('expireInThreeMonth', {page_title: " expireInThreeMonth", data: result ,data1:JSONObj})

    }, function (err) {
        console.trace(err.message);
    });

   /* console.log('expireInThreeMonth: list');
    var id = req.params.id;

    console.log('id:  ' +id );
    client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM transactions WHERE id < "+ id + "LIMIT 10 ALLOW FILTERING", [], function (err, result) {
        if (err) {""
            console.log('expireInThreeMonth: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('expireInThreeMonth: list succ:', result.rows);
            res.status(200).send(result.rows);
           // res.render('alltransaction', {page_title: "All Transactions", data: result.rows})

        }
    });*/

};

/*
 * GET cheques listing pagging previous.
 */
exports.list_paging_previous = function (req, res) {

    var id = req.params.id;
    id_for_next=id_for_next-10;
    if(id_for_next<0)
    {
        id_for_next=0;
    }
    console.log('expireInThreeMonth: list');

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

        res.render('expireInThreeMonth', {page_title: " expireInThreeMonth", data: result ,data1:JSONObj})

    }, function (err) {
        console.trace(err.message);
    });

  /*  console.log('expireInThreeMonth: list');
    var id = req.params.id;
    console.log('id:', id);
    client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM transactions WHERE expr(transaction_lucene_index," +"\'{ sort: [ {type: \"simple\", field: \"id\", reverse: true} ] }"+"\') AND bank='sampath' AND id <"+ id + " LIMIT 10 ALLOW FILTERING", [], function (err, result) {
        if (err) {""
            console.log('expireInThreeMonth: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('expireInThreeMonth: list succ:', result.rows);
            res.render('expireInThreeMonth', {page_title: "expireInThreeMonth Transactions", data: result.rows})
        }
    });*/

};

