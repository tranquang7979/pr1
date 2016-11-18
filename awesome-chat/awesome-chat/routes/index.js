var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("START RENDER INDEX");
    res.render('index', { title: 'Express' });
});

router.get('/chatroom', function(req, res, next) {
   res.render('chatroom', { title: 'Express Chat' });
});

router.get('/rooms', function(req, res, next) {
   res.render('rooms', { title: 'Express Room' });
});

router.get('/landing', function(req, res, next) {
   res.render('landing', { title: 'Landing Page' });
});


router.post('/login', function (req, res, next) {
    console.log("START RENDER INDEX");

    var soap = require('soap');

    //console.log(req.body);
    var args = req.body;
    var url = "http://local.bw838.com:5555/service-fms/ServiceFMS.asmx?WSDL";
    soap.createClient(url, function (err, client) {
        client.UserLogin(args, function (err, result) {
            console.log(result);
            res.end(JSON.stringify(result));
        });
    });
});


module.exports = router;
