const client = require("./cassandrainfo")
const client_elasticsearch =require("./elasticsearch")

/*
 * GET cheques listing pagging next.
 */
var id_for_next=0;
var JSONObj = new Object();
var JSONObj_search = new Object();
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


        res.render('allpromizes', {page_title: "Promizes Details", data: result, data1: JSONObj});

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


        res.render('allpromizes', {page_title: "Promizes Details", data: result, data1: JSONObj});

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
            JSONObj["total"]= resp.hits.total;
            JSONObj["offset"]= 0;
            JSONObj["limit"]= 10;

            res.render('allpromizes', {page_title: "Promizes Details", data: result,data1:JSONObj});


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

            JSONObj_search["total"]= resp.hits.total;
            JSONObj_search["offset"]= 0;
            JSONObj_search["limit"]= 10;
            JSONObj_search["search_field"]= input.id;


            res.render('allpromizes_search', {page_title: "Promizes Details", data: result , data2: JSONObj_search});

        }, function (err) {
            console.trace(err.message);
        });
    }
    else {
        var result = [];
        res.render('allpromizes_search', {page_title: "Promizes Details", data: result});
    }
};



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



/*
 * SEARCH NEXT promizes.
 */
exports.list_search_next = function (req, res) {

    var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));


    console.log('promizes: list_search_next');

    client_elasticsearch.search({
        index: 'promizes',

        body: {
            query: {
                bool: {
                    must: [
                        {

                            wildcard: {
                                id: JSONObj_search.search_field+ "*"

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

        JSONObj_search["offset"]+= 10;
        JSONObj_search["limit"]= 10;

        res.render('allpromizes_search', {page_title: "promizes Details", data: result ,data2:JSONObj_search});

    }, function (err) {
        console.trace(err.message);
    });

};



/*
 * SEARCH previous transactions.
 */
exports.list_search_previous = function (req, res) {

    var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    console.log(input);
    console.log('promizes: list_search');

    client_elasticsearch.search({
        index: 'promizes',

        body: {
            query: {
                bool: {
                    must: [
                        {

                            wildcard: {
                                id: JSONObj_search.search_field+ "*"

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

        JSONObj_search["offset"]-= 10;
        JSONObj_search["limit"]= 10;

        res.render('allpromizes_search', {page_title: "promizes Details", data: result ,data2:JSONObj_search});

    }, function (err) {
        console.trace(err.message);
    });

};




