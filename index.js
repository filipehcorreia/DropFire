const express = require('express')
const app = express();
var exphbs = require('express-handlebars');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const port = process.env.PORT || 3000;
const CLOUD = true;

var login_route = require("./routes/login_route");
var create_user_route = require("./routes/create_user_route.js");
var logout_route = require("./routes/logout_route");
var dashboard_route = require("./routes/dashboard_route");
var change_password_route = require("./routes/change_password_route");

app.use('/views', express.static('views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.json());

app.set('trust proxy', 1);

app.listen(port, () => {
    console.log(`Dropfire started at http://localhost:${port}`)
})



const RedisStore = connectRedis(session)

//Configure redis client
//If we are in a cloud environment it will use the host and port defined in the env variables
//Otherwise, will use local host and the port defined by the service
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 80
})
redisClient.on('error', function(err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function(err) {
    console.log('Connected to redis successfully');
});

//Configure session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'cookieSecret-cnDropFire',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}));

app.use('/auth/login', login_route);
app.use('/auth/signup', create_user_route);
app.use('/auth/logout', logout_route);
app.use('/auth/changepassword', change_password_route);
app.use('/dashboard', dashboard_route);


app.get('/', async(req, res) => {

    sess = req.session;
    if (sess.username && sess.password) {
        sess = req.session;
        if (sess.username) {
        }
    } else {}
    res.render('home', { layout: false, user: sess.username });
});
