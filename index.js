var express = require('express');
var app = express();

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/queries')

// create a bear (accessed at POST http://localhost:8080/queries)
    .post(function(req, res) {
        res.json({ message: 'Query created!' });
    })

    // get all the bears (accessed at GET http://localhost:8080/api/queries)
    .get(function(req, res) {
        res.json(['a', 'b']);
    });

// on routes that end in /queries/:qid
// ----------------------------------------------------
router.route('/queries/:qid')

// get the bear with that id
    .get(function(req, res) {
        res.json({name: 'Test'});
    })

    // update the bear with this id
    .put(function(req, res) {
        res.json({ message: 'Query updated!' });
    })

    // delete the bear with this id
    .delete(function(req, res) {
        res.json({ message: 'Successfully deleted' });
    });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.set('port', (process.env.PORT || 5000));

console.log('Magic happens on port ' + app.get('port'));


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


