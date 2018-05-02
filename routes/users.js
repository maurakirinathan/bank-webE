const client = require("./cassandrainfo")
/*
 * GET blocks listing.
 */
exports.list = function (req, res) {

    console.log('users: list');
    client.execute('SELECT * FROM users LIMIT 10', [], function (err, result) {
        if (err) {
            console.log('users: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('users: list succ:', result.rows);
            res.render('users', {page_title: "All Users", data: result.rows})
        }
    });

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

    /* var id = req.params.id;*/
    var input = JSON.parse(JSON.stringify(req.body));

    var zaddress = "\'" + input.id + "\'";
    /*  var validate = require('uuid-validate');
  */

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
    });

};


/*
 * GET cheques listing pagging next. run
 */
exports.list_paging_next = function (req, res) {

    console.log('users: list');
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
