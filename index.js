var express = require('express'),
    mongoose = require('mongoose'),
    morgan     = require('morgan'),
    bodyParser = require('body-parser');

mongoose.connect(process.env.MONGODB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var app = express();

app
    .use(morgan('dev')) // log requests to the console
    .use(bodyParser.json()) // support json encoded bodies
    .use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Mongoose Schema definition
var Schema = new mongoose.Schema({
    id       : String,
    title    : String,
    lat: String,
    lon: String
}),

    Item = mongoose.model('Item', Schema);


// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

router
    .get('/', function (req, res) {
        res.json(200, 'it\'s alive');
    })
    .get('/items', function (req, res) {
        // http://mongoosejs.com/docs/api.html#query_Query-find
        Item.find( function (err, todos ){
            res.json(200, todos);
        });
    })
    .post('/api/items', function (req, res) {
        var todo = new Item( req.body );
        todo.id = todo._id;
        // http://mongoosejs.com/docs/api.html#model_Model-save
        todo.save(function (err) {
            res.json(200, todo);
        });
    })

    .delete('/items', function (req, res) {
        // http://mongoosejs.com/docs/api.html#query_Query-remove
        Item.remove({ completed: true }, function (err ) {
            res.json(200, {msg: 'OK'});
        });
    })

    .get('/items/:id', function (req, res) {
        // http://mongoosejs.com/docs/api.html#model_Model.findById
        Item.findById( req.params.id, function (err, todo ) {
            res.json(200, todo);
        });
    })

    .put('/items/:id', function (req, res) {
        // http://mongoosejs.com/docs/api.html#model_Model.findById
        Item.findById( req.params.id, function (err, todo ) {
            todo.title = req.body.title;
            todo.completed = req.body.completed;
            // http://mongoosejs.com/docs/api.html#model_Model-save
            todo.save( function ( err, todo ){
                res.json(200, todo);
            });
        });
    })

    .delete('/items/:id', function (req, res) {
        // http://mongoosejs.com/docs/api.html#model_Model.findById
        Item.findById( req.params.id, function (err, todo ) {
            // http://mongoosejs.com/docs/api.html#model_Model.remove
            todo.remove( function ( err, todo ){
                res.json(200, {msg: 'OK'});
            });
        });
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


