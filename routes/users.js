const client = require("./cassandrainfo")
/*
 * GET blocks listing.
 */
exports.list = function (req, res) {

    console.log('users: list');


    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    client_elasticsearch.search({
        index: 'users',

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
        //  console.log(resp.hits.hits);


        res.render('users', {page_title: "All users", data: result})

    }, function (err) {
        console.trace(err.message);
    });


    /*client.execute('SELECT * FROM users LIMIT 10', [], function (err, result) {
        if (err) {
            console.log('users: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('users: list succ:', result.rows);
            res.render('users', {page_title: "All Users", data: result.rows})
        }
    });*/

};


/*
 * GET one block.
 */
exports.list_one = function (req, res) {

    var id = "\'" + req.params.id + "\'";
    console.log('users: viewing one');

    client.execute("SELECT * from users WHERE zaddress = " + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('users: viewing one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('users: viewing one succ:');
            res.render('userViewOne', {page_title: "Users Details", data: result.rows});
        }
    });

};


/*
 * GET one block.
 */
exports.list_search = function (req, res) {


    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    console.log(input);
    console.log('users: list_search');
    if (input.id) {
        client_elasticsearch.search({
            index: 'users',

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

            res.render('users', {page_title: "users Details", data: result});

        }, function (err) {
            console.trace(err.message);
        });
    }
    else {
        var result = [];
        res.render('users', {page_title: "users Details",});
    }

  /*  /!* var id = req.params.id;*!/
    var input = JSON.parse(JSON.stringify(req.body));

    var zaddress = "\'" + input.id + "\'";
    /!*  var validate = require('uuid-validate');
  *!/

    console.log(input);
    console.log('block: list_search');

    client.execute("SELECT * from users WHERE zaddress = " + zaddress + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('users: search one err:', err);
            res.status(404).send({msg: err});
            res.render('users', {page_title: "User Details",});
            //  allblocks();
        } else {
            console.log('users: search one succ:');
            res.render('users', {page_title: "User Details", data: result.rows});
        }
    });*/

};


/*
 * GET cheques listing pagging next. run
 */
var id_for_next=0;
exports.list_paging_next = function (req, res) {


    console.log('users_next: list');
    id_for_next=id_for_next+10;
    console.log('allblocks_next: list');
    var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('users: list_search');

    client_elasticsearch.search({
        index: 'users',

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

        res.render('users', {page_title: "All users", data: result})

    }, function (err) {
        console.trace(err.message);
    });

   /* console.log('users: list');
    var id = "\'" + req.params.id + "\'";

    console.log('id:  ' + id);
    client.execute("SELECT * FROM users WHERE zaddress > " + id + " LIMIT 10 ALLOW FILTERING", [], function (err, result) {
        if (err) {
            ""
            console.log('users: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('users: list succ:', result.rows);

            res.status(200).send(result.rows);

            //res.render('allblocks_next', {page_title: "All Blocks", data: result.rows})

        }
    });*/

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

    console.log('users_previous: list');
    var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);


    client_elasticsearch.search({
        index: 'users',

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

        res.render('users', {page_title: "All users", data: result})

    }, function (err) {
        console.trace(err.message);
    });
};


/*
 *  Update user inactive ;
 */

exports.user_inactive = function (req, res) {

    var id = "\'" + req.params.id + "\'";
    console.log('users: viewing one');

    client.execute("UPDATE users SET active=false WHERE zaddress= " + id, [], function (err, result) {

        if (err) {
            console.log('users: update one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('users: update one succ:');
            // res.render('userViewOne', {page_title: "Users Details", data: result.rows});
            client.execute("SELECT * from users WHERE zaddress = " + id + " ALLOW FILTERING", [], function (err, result) {
                if (err) {
                    console.log('users: viewing one err:', err);
                    res.status(404).send({msg: err});
                } else {
                    console.log('users: viewing one succ:');
                    res.render('userViewOne', {page_title: "Users Details", data: result.rows});
                }
            });
        }
    });

};


/*
 *  Update user inactive ;
 */

exports.user_active = function (req, res) {

    var id = "\'" + req.params.id + "\'";
    console.log('users: viewing one');

    client.execute("UPDATE users SET active=true WHERE zaddress= " + id, [], function (err, result) {

        if (err) {
            console.log('users: update one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('users: update one succ:');
            // res.render('userViewOne', {page_title: "Users Details", data: result.rows});
            client.execute("SELECT * from users WHERE zaddress = " + id + " ALLOW FILTERING", [], function (err, result) {
                if (err) {
                    console.log('users: viewing one err:', err);
                    res.status(404).send({msg: err});
                } else {
                    console.log('users: viewing one succ:');
                    res.render('userViewOne', {page_title: "Users Details", data: result.rows});
                }
            });
        }
    });

};
