const client = require("./cassandrainfo")
const client_elasticsearch =require("./elasticsearch")

/*
 * GET cheques listing pagging next.
 */
var id_for_next=0;
exports.list_paging_next = function (req, res) {
    id_for_next=id_for_next+10;

    console.log('allcheques: list');
    var id = req.params.id;
    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('promizes: list_search');

    client_elasticsearch.search({
        index: 'promizes',

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

        res.render('allpromizes', {page_title: "Promizes Details", data: result});

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

   console.log('allcheques: list');
    var id = req.params.id;
    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('promizes: list_search');

    client_elasticsearch.search({
        index: 'promizes',

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

        res.render('allpromizes', {page_title: "Promizes Details", data: result});

    }, function (err) {
        console.trace(err.message);
    });

};






/*
 * GET cheques listing .
 */
exports.list = function (req, res) {

    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('promizes: list_search');

        client_elasticsearch.search({
            index: 'promizes',

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
                    {amount: "desc"}
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

            res.render('allpromizes', {page_title: "Promizes Details", data: result});

        }, function (err) {
            console.trace(err.message);
        });

   /* else {
        var result = [];
        res.render('allpromizes', {page_title: "Promizes Details", data: result});
    }*/
};

/*
 * GET one cheque detail.
 */
exports.list_one = function (req, res) {

    var id = req.params.id;
    console.log('promizes: viewing one');

    client.execute("SELECT id,bank,amount,origin_zaddress from promizes WHERE id = " + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('promizes: viewing one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('promizes: viewing one succ:');
            res.render('promizesViewOne', {page_title: "Promizes Details", data: result.rows});
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
    console.log('promizes: list_search');
    if (input.id) {
        client_elasticsearch.search({
            index: 'promizes',

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

            res.render('allpromizes', {page_title: "Promizes Details", data: result});

        }, function (err) {
            console.trace(err.message);
        });
    }
    else {
        var result = [];
        res.render('allpromizes', {page_title: "Promizes Details", data: result});
    }
};

/*
exports.list_search = function (req, res) {

    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('promizes: list_search');
    if (validate(input.id)) {
        client.execute("SELECT id,bank,amount from promizes WHERE id = " + input.id + " ALLOW FILTERING", [], function (err, result) {
            if (err) {
                console.log('promizes: search one err:', err);
                res.status(404).send({msg: err});
                res.render('allpromizes', {page_title: "Promizes Details",});
                //  allblocks();
            } else {
                console.log('promizes: search one succ:');
                console.log(result.rows.length);

                res.render('allpromizes', {page_title: "Promizes Details", data: result.rows});
            }
        });
    }
    else
    {
        var result=[];
        res.render('allpromizes', {page_title: "Promizes Details", data:result});
    }
};
*/

exports.transactions_for_promize = function (req, res) {

    var id = req.params.id;
    client.execute("select id,bank,promize_amount,from_account,to_account,timestamp from transactions where promize_id=" + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('alltransaction_promize: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('alltransaction_promize: list succ:', result.rows);
            res.render('alltransaction_promize', {page_title: "All Transactions", data: result.rows})
        }
    });

};

/*exports.transactions_for_promize = function (req, res) {

    console.log('alltrans: list');
    client.execute('SELECT * FROM transactions  LIMIT 10', [], function (err, result) {
        if (err) {
            console.log('alltransaction_promize: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('alltransaction_promize: list succ:', result.rows);
            res.render('alltransaction_promize', {page_title: "All Transactions", data: result.rows})
        }
    });

};*/

//SELECT * FROM cheques where token(bank_id) > token('test4') LIMIT  2;
