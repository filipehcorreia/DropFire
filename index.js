const express = require('express')
const app = express();
var exphbs  = require('express-handlebars');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const port = process.env.PORT || 3000;

var login_route = require("./routes/login_route");
var create_user_route = require("./routes/create_user_route.js");

app.use('/views', express.static('views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.json());
app.use('/auth/login',login_route);
app.use('/auth/signup',create_user_route);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/*

const RedisStore = connectRedis(session)
//Configure redis client
const redisClient = redis.createClient({
    host: '10.206.16.3',
    port: 6379
})
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
//Configure session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'couves',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
  }));
*/



app.get('/', async (req, res) => {
  /*const sess = req.session;
  sess.username = "usrena";
  sess.password = "password";

  redisClient.keys('*', (err, keys) => {
   console.log(keys);
   redisClient.get(keys[0], (err, reply) => {
    console.log(reply);
    
    console.log(err);
   });
   console.log(err);
  });*/
  //res.json({status: sess+" Let's go"});
  res.render('home',{layout: false});
}


);






