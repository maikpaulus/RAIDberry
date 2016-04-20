global.__base = __dirname;

let express = require('express');
let config = require('./config/config');
let RAIDController = require('./lib/RAIDController');

let controller = new RAIDController(config);

let app = express();

app.use(express.static('public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views/pages');

app.get(/raidberry\/synchronize$/, function (req, res) {
    let raid = controller.getRAID(config);

    if (false !== raid) {
        raid.synchronize();
        res.send('cool, synchronizing stuff!');
    }
    else {
        res.send('did not work, sorry for that!');
    }
});

app.get(/raidberry\/status$/, function (req, res) {
    let raid = controller.getRAID(config);

    if (false !== raid) {
        raid.status(function (code, stdout) {
            res.send(stdout);
        });
    }
    else {
        res.send('no status available!');
    }
});

app.get('*', function (req, res) {
    res.send('hey, world');
});

app.listen(1234, function () {
    console.log('server started, listening on port ' + 1234);
});
