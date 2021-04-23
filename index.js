const express = require('express')
const app = express();
var exphbs  = require('express-handlebars');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const port = process.env.PORT || 3000;

var login_route = require("./routes/login_route");
var create_user_route = require("./routes/create_user_route.js");
var logout_route = require("./routes/logout_route");

app.use('/views', express.static('views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.json());

app.set('trust proxy', 1);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



const RedisStore = connectRedis(session)
//Configure redis client
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 80
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
    secret: 'segredo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
  }));

  app.use('/auth/login',login_route);
  app.use('/auth/signup',create_user_route);
  app.use('/auth/logout',logout_route);


app.get('/', async (req, res) => {
  //res.json({status: sess+" Let's go"});
  sess = req.session;
  if (sess.username && sess.password) {
      sess = req.session;
      if (sess.username) {
        console.log("logado")
         console.log(sess);
      }
  } else {
    console.log("lfefefogado")
    console.log(sess);
  }
  res.render('home',{layout: false, user: sess.username});
}




);

app.get('/test', async (req, res) => {
 
  const sess = req.session;

  console.log(req.session);

  redisClient.keys('*', (err, keys) => {
    console.log("keys");
    console.log(keys);

    redisClient.get(req.sess, (err, reply) => {
    console.log(reply);
    
    console.log(err);
    });
    console.log(err);
  });

  res.json({status: sess+" Let's go"});
  //res.render('home',{layout: false});
}
);



        app.get('/test2', async (req, res) => {
          console.log(req.session);
          sess = req.session;
    if (sess.username && sess.password) {
        sess = req.session;
        if (sess.username) {
            res.send(sess.username)
        }
      }else{
        res.send("not logged in")
      }
          //res.render('home',{layout: false});
        }
        );