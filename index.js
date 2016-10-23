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

// Mongoose ItemsSchema definition
var ItemsSchema = new mongoose.Schema({
    id       : String,
    title    : String,
    lat: String,
    lon: String
}),
    Item = mongoose.model('Item', ItemsSchema),
    PharmacySchema = new mongoose.Schema({
        id: String,
        title: String,
        address: String,
        lat: String,
        lon: String
    }),
    Pharmacy = mongoose.model('Pharmacy', PharmacySchema);



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
        Item.find( function (err, items ){
            res.json(200, {items: items});
        });
    })
    .post('/items', function (req, res) {
        var item = new Item( req.body );
        console.log(req.body);
        // http://mongoosejs.com/docs/api.html#model_Model-save
        item.save(function (err) {
            res.json(200, {item: item});
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
        Item.findById( req.params.id, function (err, item ) {
            res.json(200, {item: item});
        });
    })

    .put('/items/:id', function (req, res) {
        // http://mongoosejs.com/docs/api.html#model_Model.findById
        Item.findById( req.params.id, function (err, item ) {
            console.log(req.body);
            item.id = req.body.id;
            item.title = req.body.title;
            item.lat = req.body.lat;
            item.lon = req.body.lon;
            // http://mongoosejs.com/docs/api.html#model_Model-save
            item.save( function ( err, item ){
                res.json(200, {item: item});
            });
        });
    })

    .delete('/items/:id', function (req, res) {
        // http://mongoosejs.com/docs/api.html#model_Model.findById
        Item.findById( req.params.id, function (err, item ) {
            // http://mongoosejs.com/docs/api.html#model_Model.remove
            item.remove( function ( err, item ){
                res.json(200, {msg: 'OK'});
            });
        });
    });


router
    .get('/pharmacies', function (req, res) {
        // http://mongoosejs.com/docs/api.html#query_Query-find
        Pharmacy.find( function (err, pharmacies ){
            res.json(200, {pharmacies: pharmacies});
        });
    })
    .get('/pharmacies/:id', function (req, res) {
        // http://mongoosejs.com/docs/api.html#model_Model.findById
        Pharmacy.findById( req.params.id, function (err, item ) {
            res.json(200, {pharmacy: item});
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


